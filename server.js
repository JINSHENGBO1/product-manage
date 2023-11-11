require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const {UserSchema} = require("./models/user.schem");
const {ProductSchema} = require("./models/product.schema");
const {raw} = require("express");
const app = express();
const PORT = process.env.PORT || 8080;

const User = mongoose.model('User', UserSchema);
const Product = mongoose.model('Product', ProductSchema);

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({extended: false}))
app.use(session({
    secret: 'HELLO WORLD',
}));

function AuthGuard(req, res, next) {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    return next();
}

app.get(`/register`, (req, res) => {
    res.render('register');
})
app.get(`/login`, (req, res) => {
    res.render('login');
});

app.get('/add-product', (req, res) => {
    res.render('add-product');
})
app.get('/products/edit/:productId', async (req, res) => {
    const {productId} = req.params;
    const product = await Product.findById(productId);
    res.render('edit-product', {product});
})

app.get('/', AuthGuard, async (req, res) => {
    try {
        const {title, minPrice, maxPrice} = req.query;
        const conditions = [];
        if (title) {
            conditions.push({
                title: {
                    $regex: new RegExp(`.*${title}.*`, 'i')
                }
            })
        }
        if (minPrice) {
            conditions.push({
                price: {
                    $gte: Number(minPrice)
                }
            })
        }
        if (maxPrice) {
            conditions.push({
                price: {
                    $lte: Number(maxPrice)
                }
            })
        }
        let products = [];
        if (conditions.length > 0) {
            products = await Product.find({
                $and: conditions
            });
        } else {
            products = await Product.find();
        }
        res.render('products', { products, title, minPrice, maxPrice });
    } catch (error) {
        res.render(`products`, {error: 'Server Error!'})
    }
});

app.get(`/logout`, (req, res) => {
   req.session.userId = null;
   res.redirect('/login')
});

app.post('/register', async (req, res) => {
    const { userId, password, confirmPassword } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const oldUser = await User.findOne({
        userId
    });
    if (oldUser) {
        return res.render(`register`, {error: 'User Already Exists!'})
    }

    if (password !== confirmPassword) {
        return res.render(`register`, {error: 'Two password must same'})
    }

    const user = new User({
        userId,
        password: hashedPassword
    });

    try {
        await user.save();
        return res.render('register', {message: `Register success. Please Login`})
    } catch (error) {
        return res.render(`register`, {error: 'Server Error!'})
    }
});

app.post('/login', async (req, res) => {
    const { userId, password } = req.body;

    const user = await User.findOne({ userId: userId.trim() });

    if (user && await bcrypt.compare(password, user.password)) {
        req.session.userId = user.userId;
        res.redirect(`/`);
    } else {
        res.render('login', {error: 'Invalid credentials.'})
    }
});

app.post('/products/new', async (req, res) => {
    try {
        const { title, price, stock, image } = req.body;
        const newProduct = new Product({ title, price, stock, image });
        await newProduct.save();
        res.redirect('/');
    } catch (error) {
        return res.render(`/products/new`, {error: 'Server Error!'})
    }
});

app.post('/products/edit/:id', async (req, res) => {
    try {
        const { title, price, stock, image } = req.body;
        await Product.findByIdAndUpdate(req.params.id, { title, price, stock, image });
        res.redirect('/');
    } catch (error) {
        return res.render(`/products/edit/${req.params.id}`, {error: 'Server Error!'})
    }
});

app.get('/products/delete/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.redirect('/');
    } catch (error) {
        return res.redirect('/')
    }
});

// --------------------------- API ---------------------------------------

app.post('/api/products', async (req, res) => {
    try {
        const { title, price, stock, image } = req.body;
        const newProduct = new Product({ title, price, stock, image });
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: 'Server Error!' });
    }
});


app.put('/api/products/:id', async (req, res) => {
    try {
        const { title, price, stock, image } = req.body;
        const updatedProduct = await Product
            .findByIdAndUpdate(
                req.params.id,
                { title, price, stock, image }, { new: true }
            );
        if (!updatedProduct) {
            res.status(404).json({ error: 'Product not found' });
        } else {
            res.status(200).json(updatedProduct);
        }
    } catch (error) {
        res.status(500).json({ error: 'Server Error!' });
    }
});

app.delete('/api/products/:id', async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            res.status(404).json({ error: 'Product not found' });
        } else {
            res.status(200).json(deletedProduct);
        }
    } catch (error) {
        res.status(500).json({ error: 'Server Error!' });
    }
});

app.get('/api/products/search', async (req, res) => {
    try {
        const { title, minPrice, maxPrice } = req.query;

        const query = {};

        if (title) {
            query.title = { $regex: title, $options: 'i' };
        }

        if (minPrice) {
            query.price = { $gte: parseFloat(minPrice) };
        }

        if (maxPrice) {
            query.price = {
                ...query.price,
                $lte: parseFloat(maxPrice),
            };
        }

        const products = await Product.find(query);

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: 'Server Error!' });
    }
});






app.listen(PORT, () => {
    console.log('Server is running on port ' + PORT);
});
