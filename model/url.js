import mongoose from "mongoose";

const urlSchema = mongoose.Schema({
    original_url: {
        type: String,
        require: true,
    },
    short_url: {
        type: String,
        require: true,
    }
});

const Url = mongoose.model('Url', urlSchema);

export default Url;