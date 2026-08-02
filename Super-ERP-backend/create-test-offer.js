const mongoose = require('mongoose');
const User = require('./src/models/User');
const Lead = require('./src/models/Lead');
const Offer = require('./src/models/Offer');

async function main() {
  const uri = 'mongodb://localhost:27017/super-erp';
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB.');

    // Find admin user
    const admin = await User.findOne({ email: 'super.admin@crm.com' });
    if (!admin) {
      console.error('Super Admin user not found. Please run seed script first.');
      process.exit(1);
    }

    // Clear old data
    await Lead.deleteMany({});
    await Offer.deleteMany({});
    console.log('Cleared existing leads and offers.');

    // Create lead
    const lead = await Lead.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1-555-0199',
      source: 'Meta',
      status: 'New',
      assignedTo: admin._id
    });
    console.log(`Created Lead: ${lead.name} (${lead._id})`);

    // Create offer
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 14); // valid for 14 days

    const offer = await Offer.create({
      lead: lead._id,
      createdBy: admin._id,
      title: 'Enterprise Premium Suite Proposal',
      description: 'Full ERP solution with HR, Payroll and Advanced CRM module setup.',
      offerType: 'Product',
      price: 25000,
      validUntil: validUntil,
      status: 'Draft',
      currency: 'USD',
      images: [
        {
          url: '/uploads/offer-demo.jpg',
          caption: 'ERP Suite Architecture'
        }
      ]
    });
    console.log(`Created Offer: ${offer.title} (${offer._id})`);

  } catch (e) {
    console.error('Error:', e);
  } finally {
    await mongoose.disconnect();
  }
}

main();
