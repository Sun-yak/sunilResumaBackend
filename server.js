const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const app = express();
const PORT = process.env.PORT || 8080;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));


// Body parser middleware to handle form data
app.use(bodyParser.urlencoded({ extended: false }));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/myDatabase', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Connected successfully to MongoDB");
});

// Define a schema for the company data
const companySchema = new mongoose.Schema({
    name: String,
    email: String,
    phoneNumber: String,
    jobDescription: String
});

// Create a model from the schema
const Company = mongoose.model('Company', companySchema);

// Endpoint to handle POST requests
app.post('/submit-company-data', (req, res) => {
    const { name, email, phoneNumber, jobDescription } = req.body;
    const newCompany = new Company({
        name,
        email,
        phoneNumber,
        jobDescription
    });
    newCompany.save().then(result=>{
      res.send("Company data saved successfully!");
    });
    
});




// Route for serving the index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});



// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
