const userSchema = require("../models/UserSchema");
const propertySchema = require("../models/PropertySchema");
const bookingSchema = require("../models/BookingSchema");

//////////adding property by owner////////
const addPropertyController = async (req, res) => {
  try {
    let images = [];
    if (req.files) {
      images = req.files.map((file) => ({
        filename: file.filename,
        path: `/uploads/${file.filename}`,
      }));
    }

    const userId = (req.body && req.body.userId) || req.userId;
    const user = await userSchema.findById({ _id: userId });
    if (!user) {
      return res.status(200).send({
        success: false,
        message: "User not found",
      });
    }

    const newPropertyData = new propertySchema({
      ...req.body,
      propertyImage: images,
      ownerId: user._id,
      ownerName: user.name,
      isAvailable: "Available",
    });

    await newPropertyData.save();

    return res.status(200).send({
      success: true,
      message: "New Property has been stored",
    });
  } catch (error) {
    console.log("Error in addPropertyController ", error);
    return res.status(500).send({
      success: false,
      message: "Failed to add property",
    });
  }
};

///////////all properties of owner/////////
const getAllOwnerPropertiesController = async (req, res) => {
  const userId = (req.body && req.body.userId) || req.userId;
  try {
    const getAllProperties = await propertySchema.find();
    const updatedProperties = getAllProperties.filter(
      (property) => property.ownerId && property.ownerId.toString() === userId
    );
    return res.status(200).send({
      success: true,
      data: updatedProperties,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ message: "Internal server error", success: false });
  }
};

//////delete the property by owner/////
const deletePropertyController = async (req, res) => {
  const propertyId = req.params.propertyid;
  try {
    await propertySchema.findByIdAndDelete({
      _id: propertyId,
    });

    return res.status(200).send({
      success: true,
      message: "The property is deleted",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ message: "Internal server error", success: false });
  }
};

//////updating the property/////////////
const updatePropertyController = async (req, res) => {
  const { propertyid } = req.params;
  try {
    const updateData = {
      propertyType: req.body.propertyType,
      propertyAdType: req.body.propertyAdType,
      propertyAddress: req.body.propertyAddress,
      ownerContact: req.body.ownerContact,
      propertyAmt: req.body.propertyAmt,
      additionalInfo: req.body.additionalInfo,
      ownerId: (req.body && req.body.userId) || req.userId,
    };

    if (req.body.isAvailable) {
      updateData.isAvailable = Array.isArray(req.body.isAvailable)
        ? req.body.isAvailable[req.body.isAvailable.length - 1]
        : req.body.isAvailable;
    }

    if (req.file) {
      updateData.propertyImage = [
        {
          filename: req.file.filename,
          path: `/uploads/${req.file.filename}`,
        },
      ];
    } else if (req.files && req.files.length > 0) {
      updateData.propertyImage = req.files.map((file) => ({
        filename: file.filename,
        path: `/uploads/${file.filename}`,
      }));
    }

    const property = await propertySchema.findByIdAndUpdate(
      { _id: propertyid },
      updateData,
      { new: true }
    );

    return res.status(200).send({
      success: true,
      message: "Property updated successfully.",
    });
  } catch (error) {
    console.error("Error updating property:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update property.",
    });
  }
};

const getAllBookingsController = async (req, res) => {
  const userId = (req.body && req.body.userId) || req.userId;
  try {
    const getAllBookings = await bookingSchema.find();
    const updatedBookings = getAllBookings.filter(
      (booking) => booking.ownerID && booking.ownerID.toString() === userId
    );
    return res.status(200).send({
      success: true,
      data: updatedBookings,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ message: "Internal server error", success: false });
  }
};

//////////handle bookings status//////////////
const handleAllBookingstatusController = async (req, res) => {
  const { bookingId, propertyId, status } = req.body;
  try {
    const booking = await bookingSchema.findByIdAndUpdate(
      { _id: bookingId },
      {
        bookingStatus: status,
      },
      {
        new: true,
      }
    );

    const property = await propertySchema.findByIdAndUpdate(
      { _id: propertyId },
      {
        isAvailable: status === 'booked' ? 'Unavailable' : 'Available', 
      },
      { new: true }
    );

    return res.status(200).send({
      success: true,
      message: `changed the status of property to ${status}`,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ message: "Internal server error", success: false });
  }
};
module.exports = {
  addPropertyController,
  getAllOwnerPropertiesController,
  deletePropertyController,
  updatePropertyController,
  getAllBookingsController,
  handleAllBookingstatusController,
};
