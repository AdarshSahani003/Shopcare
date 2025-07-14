import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {User} from "../models/user.model.js"
import { Item } from "../models/item.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { sendActivationMail } from "../utils/mailer.js";
import jwt from 'jsonwebtoken'

const generateAccessTokenAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)

        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})

        return {accessToken, refreshToken}

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating Refresh & Access Token")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    
    const { email, username, password, mobile } = req.body 
    console.log(req.body);
    
    if (
        [ email, username, password, mobile].some((field) =>
        field === undefined ||
        field?.trim === "")
    ){
        throw new ApiError(400, "All Fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ email }]
    })
    if (existedUser){
        // throw new ApiError(409, "User with this email/username already exists")
        return res.status(400).json(new ApiResponse(400, {}, "user already existed"))
    }
        

    const activationToken = jwt.sign(
        { email, username, password, mobile },
        process.env.JWT_ACTIVATION_SECRET,
        { expiresIn: 3600 }
    );

  const activationLink = `${process.env.BASE_URL}/verify/${activationToken}`;
  await sendActivationMail(email, activationLink);

  return res.status(200).json(
    new ApiResponse(200, {}, "Activation email sent. Please check your inbox."))


    // const user = await User.create({
    //     // fullname,
    //     // avatar: avatar.url,
    //     // coverImage: coverImage?.url || "",
    //     email,
    //     password,
    //     mobile,
    //     username: username.toLowerCase()
    // })

    // const createdUser = await User.findById(user._id).select(
    //     "-password -refreshToken" 
    // )

    // if(!createdUser){
    //     throw new ApiError(500, "Something went wrong while registering the user")
    // }

    // return res.status(201).json(
    //     new ApiResponse(200, createdUser, "User Registered Successfully!")
    // )
})

const verificationId = asyncHandler( async (req, res) => {
    const { token } = req.params;
    console.log(token);
    try {
        //console.log("step0dfdfdf");
        const decodedlog = jwt.decode(token);
       // console.log("Decoded JWT:", decodedlog);
        const decoded = jwt.verify(token, process.env.JWT_ACTIVATION_SECRET)
        // console.log('decoded',decoded);

        const newUser = await User.create({
        email: decoded.email,
        username: decoded.username,
        password: decoded.password,
        mobile: decoded.mobile
        }); 
       // console.log(newUser);
        
        return res.status(201).json(new ApiResponse(201, {newUser}, "Account activated"));
    } catch (err) {
      console.error("JWT error:", err.message);
        throw new ApiError(400, "Invalid or expired activation link");
    }
})

 
const listItem = asyncHandler(async (req, res) => {
    const { itemName, price, description, usedInMonths, condition, category } = req.body;
    console.log(req.body);

    // Validation for required fields
    if ([itemName, price, description, usedInMonths, condition, category].some(field => !field || field.trim === "")) {
        throw new ApiError(400, "All fields are required");
    }

    // Check for multiple images
    const files = req.files.itemImageUrl;
    console.log("image ", files);
    if (!files || files.length === 0) {
        throw new ApiError(400, "At least one image is required");
    }

    // Upload each image and collect URLs
    const imageUploadPromises = files.map(file => uploadOnCloudinary(file.path));
    const uploadedImages = await Promise.all(imageUploadPromises);

    const failedUploads = uploadedImages.filter(img => !img?.url);
    if (failedUploads.length > 0) {
        throw new ApiError(400, "One or more images failed to upload");
    }

    const imageUrls = uploadedImages.map(img => img.url);

    // Create the item
    const item = await Item.create({
        itemName,
        price,
        description,
        itemImageUrl: imageUrls,  // ✅ Store all image URLs
        usedInMonths,
        condition,
        category
    });
    console.log("upload imae",imageUrls);

    // Update user with listed item
    console.log(req.user)
    const listing = await User.findByIdAndUpdate(
        req.user._id,
        { $push: { listedItems: item._id } },
        { new: true }
    );

    if (!listing) {
        throw new ApiError(400, "Listing failed");
    }

    return res.status(201).json(
        new ApiResponse(201, item, "Item listed successfully")
    );
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Refresh token missing");
  }

  try {
    const decoded = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decoded._id);

    if (!user || user.refreshToken !== incomingRefreshToken) {
      throw new ApiError(401, "Invalid refresh token");
    }

    // Generate new access token
    const newAccessToken = user.generateAccessToken();

    const isDev = process.env.NODE_ENV !== "production";
    const cookieOptions = {
      httpOnly: true,
      secure: !isDev,
      sameSite: isDev ? 'Lax' : 'None',
      maxAge: 15 * 60 * 1000 // 15 minutes in ms
    };

    res.cookie("accessToken", newAccessToken, cookieOptions);

    return res.status(200).json({
      success: true,
      message: "Access token refreshed"
    });

  } catch (err) {
    throw new ApiError(401, "Invalid or expired refresh token");
  }
});

const buyItem = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { _id } = req.body;
  const itemId = _id;
  

  if (!itemId) {
    throw new ApiError(400, "Item ID is required");
  }

  const item = await Item.findById(itemId);
  if (!item) {
    throw new ApiError(404, "Item not found");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { buyedItems: itemId } },
    { new: true }
  ).populate("buyedItems");

  if (!user) {
    throw new ApiError(500, "Failed to order");
  }

  return res.status(200).json(
    new ApiResponse(200, user.buyedItems, "Item successfully purchases"));
})

const getSingleBuyItem = async (req, res) => {
  try {
    const { _id } = req.body;
    console.log(_id);

    // Find item by ID
    const item = await Item.findById(_id);

    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    console.log("Category:", item.category);

    // Find all related items with the same category, excluding the current item
    const relatedItems = await Item.find({
      category: item.category,
      _id: { $ne: item._id }  // optional: exclude current item
    });

    //console.log("Related items:", relatedItems);

    return res.status(200).json({
      success: true,
      data: item,
      relatedItems,
      message: "Single item fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching item:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};



const getAllListedItems = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const search = req.query.search || "";
  const condition = req.query.condition;
  const minPrice = req.query.minPrice;
  const maxPrice = req.query.maxPrice;
  const usage = req.query.usage; // comma-separated: "3,6,12"

  // Dynamic Filter Object
  const searchFilter = {
    ...(search && {
      $or: [
        { itemName: { $regex: search, $options: "i" } },
        { discription: { $regex: search, $options: "i" } },
      ],
    }),
    ...(condition && { condition }),

    ...(minPrice && maxPrice && {
      price: { $gte: Number(minPrice), $lte: Number(maxPrice) },
    }),

    ...(usage && {
    $expr: {
      $gte: [
        {
          $toInt: {
            $arrayElemAt: [{ $split:  [{ $toString: "$usedInMonths" }, " "] }, 0],
          },
        },
        parseInt(usage),
      ],
    },
  }),
  };

  const totalItems = await Item.countDocuments(searchFilter);

  const items = await Item.find(searchFilter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        items,
        pagination: {
          totalItems,
          currentPage: page,
          totalPages: Math.ceil(totalItems / limit),
          hasNextPage: skip + limit < totalItems,
          hasPreviousPage: page > 1,
        },
      },
      "Filtered and paginated items fetched successfully"
    )
  );
});


const getUserItems = asyncHandler(async (req, res) => {
    const userId = req.user?._id;    

    if (!userId) {
        throw new ApiError(401, "Unauthorized: User not authenticated");
    }

    const user = await User.findById(userId)
        .populate("listedItems")  // Populates full item docs
        .populate("buyedItems")
        .select("listedItems buyedItems"); // Select only these fields

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(
        new ApiResponse(200, { 
            listedItems: user.listedItems,
            buyedItems: user.buyedItems
        }, "Fetched user items successfully")
    );
});

const loginUser = asyncHandler( async(req, res) => {
    const {email, password} = req.body

    
    if (!email) {    // && or ||
        throw new ApiError (400, "phone no or email is required")
    }

    const user = await User.findOne({
        $or: [{email}]
    })
    if (!user) {
        throw new ApiError(404, "User not Found")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials")
    }

    const {accessToken, refreshToken} = await 
    generateAccessTokenAndRefreshToken(user._id)
   // console.log("accesstoken is ",accessToken);
    
    const loggedInUser = await User.findById(user._id).
    select("-password -refreshToken")
    const isDev = process.env.NODE_ENV !== "production"
    const options = {
        httpOnly: true,
        secure: !isDev, // true only in production (HTTPS)
        sameSite: isDev ? 'Lax' : 'None', // 'None'
        maxAge: 7*24*60*60*1000
    }
    
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged in Successfully"
        )
    )
})

const logoutUser = asyncHandler( async(req, res) => {
        console.log(req.user._id);
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $set: {
                    refreshToken: undefined,
                     
                }
            },
            {
                new: true
            }
        )
        const isDev = process.env.NODE_ENV !== "production"
        const options = {
             httpOnly: true,
             secure: !isDev, // ❗ must match how it was set
             sameSite: isDev ? 'Lax' : 'None',
        }
        return res
        .status(200)
        .clearCookie("accessToken",options)
        .clearCookie("refreshToken", options)
        .json( new ApiResponse(200, {}, "User logged out"))

})

export {registerUser, loginUser, logoutUser, listItem, getSingleBuyItem , buyItem, getAllListedItems, verificationId, getUserItems}


// get user details from frontend
// validate
// check if user exists
// password check
// token generation
// send cookie


// get user details from frontend
// validation - not empty
// check if user already exists
// check for images, check for avatar
// upload them to cloudinary, chcek for avatar here too
// create user object - create entry in db
// remove password and refresh token field from response
// check for yser creation
// return response