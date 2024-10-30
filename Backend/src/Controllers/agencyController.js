import Agency from "../Models/Agency.js";
import Client from "../Models/Client.js";
import AgencyUser from "../models/AgencyData.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const registerAgency = async (req, res) => {
  try {
    const { name, password } = req.body;

    if (!name || !password) {
      return res
        .status(400)
        .json({ message: "Name and password are required." });
    }

    try {
      const existingUser = await AgencyUser.findOne({ name });
      if (existingUser) {
        return res.status(400).json({ message: "Agency user already exists." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newAgencyUser = new AgencyUser({
        name,
        password: hashedPassword,
      });

      await newAgencyUser.save();

      res.status(201).json({
        success: true,
        message: "Agency registered successfully",
        token,
        agencyUser: {
          id: newAgencyUser._id,
          name: newAgencyUser.name,
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Failed to register agency", error });
    }
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ message: "Failed to create agency and client", error });
  }
};

const loginAgency = async (req, res) => {
  try {
    const { name, password } = req.body;

    if (!name || !password) {
      return res
        .status(400)
        .json({ message: "Name and password are required." });
    }

    const existingUser = await AgencyUser.findOne({ name });
    if (!existingUser) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign(
      { id: existingUser._id, name: existingUser.name },
      process.env.JWT_SECRET || "secret_key",
      { expiresIn: "1h" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      agencyUser: {
        id: existingUser._id,
        name: existingUser.name,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to login agency", error });
  }
};

const createAgencyWithClient = async (req, res) => {
  const { agency, client } = req.body;

  if (
    !agency.name ||
    !agency.address1 ||
    !agency.state ||
    !agency.city ||
    !agency.phoneNumber
  ) {
    return res.status(400).json({ message: "All agency fields are required." });
  }
  if (
    !client.name ||
    !client.email ||
    !client.phoneNumber ||
    !client.totalBill
  ) {
    return res.status(400).json({ message: "All client fields are required." });
  }

  try {
    const newAgency = Agency(agency);
    await newAgency.save();
    client.agencyId = newAgency._id;
    console.log(newAgency._id);

    const newClient = await Client(client);
    await newClient.save();
    res.status(201).json({
      success: true,
      message: "Agency and client created successfuly",
      agency: newAgency,
      client: newClient,
    });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ message: "Failed to create agency and client", error });
  }
};

// Return the agency with the client that has the highest total bill
const getTopClient = async (req, res) => {
  try {
    const topClient = await Client.findOne()
      .sort({ totalBill: -1 })
      .populate("agencyId", "name");
    if (!topClient)
      return res.status(404).json({ message: "No clients found" });
    res.json({
      agencyName: topClient.agencyId.name,
      clientName: topClient.name,
      totalBill: topClient.totalBill,
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving top client", error });
  }
};

export default {
  registerAgency,
  loginAgency,
  createAgencyWithClient,
  getTopClient,
};
