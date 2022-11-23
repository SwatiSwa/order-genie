require("dotenv").config();
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const { SalesOrder, Package, Shipment, Role, User } = require('./models');

const { MONGO_DB_URI } = process.env;

const seed = async () => {
  console.log(`Connecting to DB`);
  await mongoose.connect(MONGO_DB_URI);
  console.log(`Connected to DB`);
  await seedOrderData();
  await seedUserData();
}

const seedOrderData = async() => {
  for (let i = 0; i < 100; i++) {
    console.log(`Processing item ${i + 1}`);
    const soId = `SO-${faker.random.numeric()}`;
    const packageId = `PKG-${faker.random.numeric()}`;
    const shipmentId = `SHO-${faker.random.numeric()}`;
    const customerId = `CX-${faker.random.numeric()}`;
    const customerName = faker.name.fullName();
    const salesEmail = faker.internet.email();
    const createdBy = faker.internet.email();
    const updatedBy = faker.internet.email();
    const commonAttributes = {
      customerId,
      customerName,
      amount: 100,
      salesEmail,
      createdBy,
      updatedBy
    };

    const salesOrder = {
      soId,
      status: "confirmed",
      ...commonAttributes
    };
    const orderPackage = {
      packageId,
      status: "packed",
      soId,
      shipmentId,
      ...commonAttributes
    };
    const shipment = {
      shipmentId,
      packageId,
      soId,
      status: "shipped",
      ...commonAttributes
    };
    await SalesOrder.insertMany([salesOrder]);
    await Package.insertMany([orderPackage]);
    await Shipment.insertMany([shipment]);
  };
}

const seedUserData = async() => {
  await Role.insertMany([{
    name: "Super Admin",
    formattedName: "super_admin",
    permissions: [
      "VIEW_SALES_ORDERS", 
      "VIEW_SHIPMENTS", 
      "VIEW_PACKAGES"
    ],
    status: "active",
    createdBy: "thiru@gmail.com",
    updatedBy: "thiru@gmail.com"
  },{
    name: "Agent",
    formattedName: "agent",
    permissions: [
      "VIEW_SALES_ORDERS"
    ],
    status: "active",
    createdBy: "thiru@gmail.com",
    updatedBy: "thiru@gmail.com"
  }]);

  for (let i = 0; i < 100; i++) {
    console.log(`Processing item ${i + 1}`);
    const createdBy = faker.internet.email();
    const updatedBy = faker.internet.email();
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const gender = faker.name.gender();

    await User.insertMany([{
      firstName,
      lastName,
      gender,
      dob: faker.date.birthdate({min: 1900, max: 2000, mode: 'year'}),
      avatar: faker.image.avatar(),
      email: faker.internet.email(firstName, lastName),
      phone: faker.phone.number(),
      status: faker.helpers.arrayElement(["active"]),
      lastLoginAt:new Date(),
      createdBy,
      updatedBy
    }]);
  };
}

seed();
