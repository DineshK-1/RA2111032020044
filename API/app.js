const express = require('express')
const app = express()
const port = 5000
const axios = require('axios');

let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzEyMTU1OTUyLCJpYXQiOjE3MTIxNTU2NTIsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjQ4MGY0YTk0LThiNDYtNGY4YS04NDU3LTE3NTRhMTc4YjMxYiIsInN1YiI6ImRrMTk4OUBzcm1pc3QuZWR1LmluIn0sImNvbXBhbnlOYW1lIjoiZGluZXNoR29vZHMiLCJjbGllbnRJRCI6IjQ4MGY0YTk0LThiNDYtNGY4YS04NDU3LTE3NTRhMTc4YjMxYiIsImNsaWVudFNlY3JldCI6IkZjQmZMUWdLc25RVnJ4UWciLCJvd25lck5hbWUiOiJEaW5lc2ggS3VtYXIgUyIsIm93bmVyRW1haWwiOiJkazE5ODlAc3JtaXN0LmVkdS5pbiIsInJvbGxObyI6IlJBMjExMTAzMjAyMDA0NCJ9.KHAWmpkq5whyb9q71hg0YorQP_xdi3GG8tBuj6f_OTs";
let tokenExpiry = 1712155952000;

let companies = ["AMZ", "FLP", "SNP", "MYN", "AZO"]

let products = {

}

app.get('/', (req, res) => {
    res.send('Hello World!')
})




app.get('/categories/:categoryName/products', async (req, res) => {
    const categoryName = req.params.categoryName;
    const n = req.query.n;

    try {
        const products = await getProducts(categoryName, top);
        res.json(products);
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/categories/:categoryName/products/:productId', async (req, res) => {
    const categoryName = req.params.categoryName;
    const productId = req.params.productId;

    try {
        const bearerToken = await getBearerToken();
        console.log(bearerToken)
        const product = await getProductById(categoryName, productId, bearerToken);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (err) {
        // console.error('Error fetching product:', err);
        // res.status(500).json({ error: 'Internal Server Error' });
    }
});

async function getBearerToken() {
    console.log(token, tokenExpiry > Date.now())

    if (token && tokenExpiry > Date.now()) {
        return token;
    }

    try {
        const response = await axios.post('http://20.244.56.144/test/auth', {
            companyName: 'dineshGoods',
            clientID: '480f4a94-8b46-4f8a-8457-1754a178b31b',
            clientSecret: 'FcBfLQgKsnQVrxQg',
            ownerName: 'Dinesh Kumar S',
            ownerEmail: 'dk1989@srmist.edu.in',
            rollNo: 'RA2111032020044',
        });

        token = response.data.accessToken;
        console.log(response.data)
        tokenExpiry = Date.now() + response.data.expiresIn * 1000;
        return token;
    } catch (err) {
        console.error('Error fetching bearer token:', err);
        throw err;
    }
}


async function getProductById(categoryName, productId) {
    try {
        const response = await axios.get(`http://20.244.56.144/test/companies/AMZ/categories/${categoryName}/products/${productId}`, {
            headers: {
                Authorization: `Bearer ${bearerToken}`,
            },
        });
        return response.data;
    } catch (err) {
        if (err.response && err.response.status === 404) {
            return null;
        } else {
            console.error('Error fetching product:', err);
            throw err;
        }
    }
}

async function getProducts(categoryName, top, minPrice, maxPrice, bearerToken) {
    try {
        const bearerToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzEyMTUzNzA2LCJpYXQiOjE3MTIxNTM0MDYsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjQ4MGY0YTk0LThiNDYtNGY4YS04NDU3LTE3NTRhMTc4YjMxYiIsInN1YiI6ImRrMTk4OUBzcm1pc3QuZWR1LmluIn0sImNvbXBhbnlOYW1lIjoiZGluZXNoR29vZHMiLCJjbGllbnRJRCI6IjQ4MGY0YTk0LThiNDYtNGY4YS04NDU3LTE3NTRhMTc4YjMxYiIsImNsaWVudFNlY3JldCI6IkZjQmZMUWdLc25RVnJ4UWciLCJvd25lck5hbWUiOiJEaW5lc2ggS3VtYXIgUyIsIm93bmVyRW1haWwiOiJkazE5ODlAc3JtaXN0LmVkdS5pbiIsInJvbGxObyI6IlJBMjExMTAzMjAyMDA0NCJ9.E7FrO47XRI4kGra6ziTOKK3_atdt69gB4HLgwvh59Ik";
        const response = await axios.get(`http://20.244.56.144/test/companies/AMZ/categories/${categoryName}/products?top=${top}&minPrice=${minPrice}&maxPrice=${maxPrice}`, {
            headers: {
                Authorization: `Bearer ${bearerToken}`,
            },
        });

        return response.data;
    } catch (err) {
        // console.error('Error fetching products:', err);
        // throw err;
    }
}


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})