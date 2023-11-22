const VenueModel = require("../../models/venue");
const fetch = require('node-fetch');

async function getLatLong(address) {
    const apiUrl = `https://geocode.maps.co/search?${address}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        // Assuming data is an array and you want the first result's lat and lon
        if (Array.isArray(data) && data.length > 0) {
            return {
                latitude: data[0].lat,
                longitude: data[0].lon
            };
        }
        return null;
    } catch (error) {
        console.error("Error fetching latitude and longitude: ", error);
        return null;
    }
}

const VenueControllers = {

    async createVenue(req, res) {
        //creation des default data
        let createValues = req.body;
        createValues["owner.user_id"] = req.decodedToken._id;
        // creation de l'event
        VenueModel.create(createValues)
            .then((result) => {
                return res.status(200).send({
                    success: true,
                    message: "event data",
                    data: result,
                });
            })
            .catch((err) => {
                //si non rien on sort
                return res.status(400).send({
                    success: false,
                    message: "Erreur data space",
                    data: err,
                });
            });
    },

    async addPrimaryPicVenue(imageName, routeId, res) {
        VenueModel.findOneAndUpdate({
            _id: routeId
        }, {
            $set: {
                primaryPic: imageName
            },
        }, {
            new: true,
            runValidators: true
        }).then((updatedVenue) => {
            if (updatedVenue) {
                res.status(200).send({
                    success: true,
                    message: "Image added to primary pics",
                    data: updatedVenue
                });
            } else {
                res.status(404).send({
                    success: false,
                    message: "Venue not found"
                });
            }
        })
            .catch((err) => {
                res.status(400).send({
                    success: false,
                    message: "Error adding image to primary pics",
                    error: err
                });
            });
    },

    async publishVenue(req, res) {
        VenueModel.findOneAndUpdate({
            _id: req.body._id
        }, {
            $set: {
                isPublished: true
            },
        }, {
            new: true,
            runValidators: true
        }).then((published) => {
            console.log(published);
        })
            .catch((err) => {
                res.status(400).send({
                    success: false,
                    message: "Error adding image to primary pics",
                    error: err
                });
            });
    },

    async addVenueAddressData(venueId, venueName, street, city, pCode, country, res) {
        const addressString = `street=${street}&city=${city}&state=&postalcode=${pCode}&country=${country}`;

        try {
            const geoData = await getLatLong(addressString);

            if (geoData && geoData.latitude && geoData.longitude) {
                VenueModel.findOneAndUpdate({
                    _id: venueId
                }, {
                    $set: {
                        name: venueName,
                        'address.street': street,
                        'address.city': city,
                        'address.pcode': pCode,
                        'address.country': country,
                        'address.coordonates.latitude': parseFloat(geoData.latitude), // Assuming the data is string, convert to number
                        'address.coordonates.longitude': parseFloat(geoData.longitude),
                    },
                }, {
                    new: true,
                    runValidators: true
                }).then((updatedAddress) => {
                    if (updatedAddress) {
                        res.status(200).send({
                            success: true,
                            message: "Venue Address Data updated",
                            data: updatedAddress
                        });
                    } else {
                        res.status(404).send({
                            success: false,
                            message: "Venue not found"
                        });
                    }
                }).catch((err) => {
                    res.status(400).send({
                        success: false,
                        message: "Error updating address data for the venue",
                        error: err
                    });
                });
            } else {
                res.status(400).send({
                    success: false,
                    message: "Error fetching latitude and longitude from geocoding service"
                });
            }
        } catch (error) {
            res.status(500).send({
                success: false,
                message: "Internal server error",
                error: error
            });
        }
    },

    async dataVenue(req, res) {
        VenueModel.findById(req.body._id)
            // Key to populate with specific nested fields
            .populate("owner.user_id staff.staff_id", "userTag profileName owner")
            .exec((err, user) => {
                if (err)
                    return res.status(400).send({
                        success: false,
                        message: "Error | Venue data not collected",
                    });
                if (user === null) {
                    return res.status(400).send({
                        success: false,
                        message: "Error | Venue might be deleted",
                    });
                }
                return res.status(200).send({
                    success: true,
                    message: "Success | Venue Data collected",
                    data: user,
                });
            });
    },


    personalOperatorVenue(req, res, next) {
        VenueModel.find({
            $and: [
                {
                    "owner.user_id": req.decodedToken._id
                },
                {
                    "spaceAssociated": req.body.sendSpaceAssociated
                },
            ],
        })
            .populate("owner.user_id staff.staff_id", "userTag profileName owner")
            .exec((err, result) => {
                if (err)
                    return res.status(400).send({
                        success: false,
                        message: "Erreur personalOperator",
                    });
                return res.status(200).send({
                    success: true,
                    message: "Ok personalOperator",
                    data: result,
                });
            });
    },

    async findPublishedVenue(req, res, next) {
        try {
            VenueModel.find({ isPublished: true })
                .exec((err, publishedVenuesData) => {
                    if (err)
                        return res.status(400).send({
                            success: false,
                            message: "Error | Retrieving published venues",
                        });
                    return res.status(200).send({
                        success: true,
                        message: "Success | Retrieving published venues",
                        data: publishedVenuesData,
                    });
                });
        } catch (error) {
            console.error('Error', error);
            return res.status(400).send({
                success: false,
                message: "Error | Using venue model",
            });

        }
    }
}

module.exports = VenueControllers;