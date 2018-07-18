const mongoose = require('mongoose');
const Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

const GeoSchema = mongoose.Schema({

    type: {type: String, default: "Point"},
    coordinates: {type: [Number], index: "2dsphere", required: true}

});
const rwaUserData = mongoose.Schema({


    path: [{type: String}],
    time: {type: String, default: Date},
    contact: {type: String, required: true},
    contact_name: {type: String, required: true},
    apartment_name: {type: String, required: true},
    city: {type: String, required: true},

    person_assigned: {type: ObjectId},

    geometry: GeoSchema

});


const RWAUserData = module.exports = mongoose.model('rwaexecutives', rwaUserData);

module.exports.addRwaSociety = function (data, callback) {

    const contact = data.body.contact;
    const contact_name = data.body.contact_name;
    const apartment_name = data.body.apartment_name;
    const lat = data.body.lat;
    const lng = data.body.lng;

    const city = data.body.city;
    console.log("name " + contact_name);
    console.log("name2 " + apartment_name);
    console.log("name3 " + contact);



    const RwaData = new RWAUserData({

        contact: contact,
        contact_name: contact_name,
        apartment_name: apartment_name,
        city: city,
        geometry: {type: "point", coordinates: [parseFloat(lng), parseFloat(lat)]}

    });

    RwaData.save(function (err) {
        if (err) throw err;
        else callback();
    });


};

module.exports.nearBySocities = function (data, callback) {


    const lat = parseFloat(data.body.lat);
    const lng = parseFloat(data.body.lng);

    console.log("this is lat " + lat);
    console.log("this is lng " + lng);

    RWAUserData.aggregate(
        [
            {
                '$geoNear': {
                    near: {type: "Point", coordinates: [lng, lat]},
                    spherical: true,
                    distanceField: "dist.calculated",
                    maxDistance: 20 * 1000,
                    distanceMultiplier: 0.001
                }
            }
        ],
        function (err, results) {
            if (err) throw err;
            else callback(results);


        }
    );


};

module.exports.getSocieties=function (req,res,callback) {

    RWAUserData.find({},function (err,data) {

        if(err){
            res.status(500).json({error:err});
        }
        else{
            callback(data);
        }
    })


};
