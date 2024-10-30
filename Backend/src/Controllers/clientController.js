import Client from "../Models/Client.js";

const updateClient = async (req, res) => {
  const { id } = req.params;
  console.log(id);

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
    const updatedClient = await Client.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedClient)
      return res.status(404).json({ message: "Client not found" });
    res.json(updatedClient);
  } catch (error) {
    res.status(400).json({ message: "Failed to update client", error });
  }
};

export default { updateClient };
