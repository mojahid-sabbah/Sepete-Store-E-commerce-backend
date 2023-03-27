import { userModel } from "../../../../DB/models/user.model.js";
import bcrypt from 'bcryptjs'; // npm i bcryptjs
import jwt from 'jsonwebtoken'; // npm i jsonwebtoken 
import { sendEmail } from '../../../services/email.js';

export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if email already exists in database
        const user = await userModel.findOne({ email });
        if (user) {
            return res.json({ message: "Email already exists" });
        }

        // Hash the password
        const hashPassword = await bcrypt.hash(password, parseInt(process.env.saltRound));

        // Create a new user with the hashed password
        const newUser = new userModel({ email, userName: name, password: hashPassword });

        // Generate email confirmation token and refresh token
        const token = await jwt.sign({ id: newUser._id }, process.env.CONFIRMEMAILTOKEN, { expiresIn: '1h' });
        const reFreshToken = await jwt.sign({ id: newUser._id }, process.env.CONFIRMEMAILTOKEN);

        // Create the confirmation email message and send it
        const confirmationUrl = `${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/confirmEmail/${token}`;
        const message = `
        <div class="card">
          <div class="card-header">Featured</div>
          <div class="card-body">
            <h5 class="card-title">Special title treatment</h5>
            <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
            <a href="${confirmationUrl}" class="btn btn-primary">Confirm Email</a>
          </div>
        </div>`;
        const resendTokenUrl = `${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/RFToken/${reFreshToken}`;
        const messageFrtoken = `<a href="${resendTokenUrl}" class="btn btn-primary">Resend verify token</a>`;
        await sendEmail(email, "Confirm Email", `${message} <br/> ${messageFrtoken}`);

        // Save the new user to the database and send response
        const savedUser = await newUser.save();
        res.json({ message: "Success", savedUser });

    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};


export const confirmEmail = async (req, res) => {
    try {
        const { token } = req.params;
        const decoded = jwt.verify(token, process.env.CONFIRMEMAILTOKEN);

        if (!decoded.id) {
            return res.status(400).json({ message: "Invalid token payload" });
        }
        const user = await userModel.findByIdAndUpdate(
            decoded.id,
            { confirmEmail: true },
            { new: true }
        );

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        res.json({ message: "Email confirmed successfully" });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "Error confirming email", error });
    }
};

export const reFreshToken = async (req, res) => {
    const { reFreshToken } = req.params;
    try {
        const decoded = jwt.verify(reFreshToken, process.env.CONFIRMEMAILTOKEN);
        const user = await userModel.findById(decoded.id).select('email confirmEmail');

        if (!decoded?.id || !user) {
            return res.json({ message: "Invalid token" });
        }

        if (user.confirmEmail) {
            return res.status(400).json({ message: "Email already confirmed" });
        }

        const newToken = await jwt.sign({ id: user._id }, process.env.CONFIRMEMAILTOKEN, { expiresIn: 60 * 5 });
        const confirmationUrl = `${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/confirmEmail/${newToken}`;
        const resendTokenUrl = `${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/RFToken/${newToken}`;
        const message = `
        <div class="card">
          <div class="card-header">Featured</div>
          <div class="card-body">
            <h5 class="card-title">Special title treatment</h5>
            <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
            <a href="${confirmationUrl}" class="btn btn-primary">Confirm Email</a>
          </div>
        </div>
      `;
        const messageFrtoken = `<a href="${resendTokenUrl}" class="btn btn-primary">Resend verification token</a>`;
        await sendEmail(user.email, "Confirm Email", `${message} <br/> ${messageFrtoken}`);
        res.status(201).json({ message: "Verification email sent" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Error while refreshing token", error });
    }
};

export const signin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid account' });
        }

        if (!user.confirmEmail) {
            return res.status(401).json({ message: 'Please verify your email' });
        }

        if (user.blocked) {
            return res.status(400).json({ message: 'Blocked Account' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const token = jwt.sign({ id: user._id }, process.env.LOGIN_TOKEN_SECRET, {
            expiresIn: '1d'
        });

        res.json({ message: 'Success', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};
