//Core Package/Module
const fs = require(`fs`);

//Our Own Package

//Third Party Package/<odule
const express = require('express');
const app = express();

//middleware dari express
//memodifikasi incoming reaquest
app.use(express.json());

const port = process.env.port || 3000 //standart code node js


//baca data dari file JSON
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));


app.get('/api/v1/tours', (req, res) => {
    res.status(200).json({
        status:"success",
        data: {
            tours
        }
    })
})


app.get('/api/v1/tours/:id', (req, res) => {
    const id = req.param.id * 1;
    const tour = tours.find(el => el.id === id)
    
    if(!tour) {
        return res.status(404).json({
            status: 'failed',
            message: `data with ${id} this not found`
        }) 
    }

    res.status(200).json({
        status:'success',
        data: {
            tour
        }
    })
})


app.post('/api/v1/tours', (req, res) => {
    const newId = tours[tours.length - 1].id + 1; //generate id untuk data baru dari reaquest api kita
    const newData = Object.assign({ id: newId }, req.body);
    tours.push(newData);
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(201).json({ //201 = created
            status: "success",
            data : {
                tour: newData
            }
        })
    })
})


app.patch('/api/v1/tours/:id', (req, res) => {
    const id = req.params.id * 1;
    const tourIndex = tours.findIndex(el => el.id === id) // findIndex = -1 (kalau data nya gk ada)
    
    if(tourIndex === -1) {
        return res.status(404).json({
            status: 'failed',
            message: `data with ${id} this not found`
        }) 
    }

    tours[tourIndex] = {...tours[tourIndex], ...req.body}

    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(200).json({
            status:"success",
            message: `tour with this id ${id} edited`,
            data: {
                tour: tours[tourIndex]
            }
        })
    })
})


app.delete('/api/v1/tours/:id', (req, res) => {
    const id = req.params.id * 1; //konversi string jadi number/int

    const tourIndex = tours.findIndex(el => el.id === id); //cari index dari data yg sesuai id di req.params

    // validasi kalau data yg sesuai req.params.id nya gak ada
    if(tourIndex === -1) {
        return res.status(404).json({
            status: 'failed',
            message: 'data not found'
        })
    }

    tours.splice(tourIndex, 1); // proses mengahpus data sesuai index array nya => req.params.id

    //proses update di file json nya
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(200).json({
            status:"success",
            message: `Berhasil delete data`,
            data: null
        })
    })
})


app.listen(port, () => {
    console.log(`App running on port ${port}...`);
})
