-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash TEXT NOT NULL,
    role VARCHAR(50) NOT NULL, -- 'business' or 'consumer'
    is_verified BOOLEAN DEFAULT FALSE,
    verification_code VARCHAR(6),
    address_data TEXT -- Encrypted address
);

-- Create Businesses Table
CREATE TABLE IF NOT EXISTS businesses (
    business_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255)
);

-- Create Products Table
CREATE TABLE IF NOT EXISTS products (
    product_id SERIAL PRIMARY KEY,
    business_id INTEGER REFERENCES businesses(business_id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2),
    type VARCHAR(50), -- 'fixed' or 'auction'
    address TEXT, -- Encrypted full address
    public_location VARCHAR(255), -- USA, State, Zip
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Auctions Table
CREATE TABLE IF NOT EXISTS auctions (
    auction_id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(product_id),
    start_price DECIMAL(10, 2),
    buy_now_price DECIMAL(10, 2),
    end_time TIMESTAMP
);

-- Create Bids Table
CREATE TABLE IF NOT EXISTS bids (
    bid_id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(product_id),
    user_id INTEGER REFERENCES users(user_id),
    amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Messages Table
CREATE TABLE IF NOT EXISTS messages (
    message_id SERIAL PRIMARY KEY,
    sender_id INTEGER REFERENCES users(user_id),
    receiver_id INTEGER REFERENCES users(user_id),
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
