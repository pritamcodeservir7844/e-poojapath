import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import User from "../models/User";
import Temple from "../models/Temple";
import Puja from "../models/Puja";
import Chadawa from "../models/Chadawa";
import Booking from "../models/Booking";
import Blog from "../models/Blog";
import Ad from "../models/Ad";

const MONGODB_URI = process.env.MONGODB_URI!;

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log("🔗 Connected to MongoDB");

  // Clear all
  await Promise.all([User, Temple, Puja, Chadawa, Booking, Blog, Ad].map((M) => M.deleteMany({})));
  console.log("🗑️  Cleared existing data");

  const hashedPw = await bcrypt.hash("password123", 12);

  // Users
  const [admin, owner1, owner2, owner3, user1, user2] = await User.insertMany([
    { name: "Admin Sharma",      email: "admin@epoojapaath.com",  password: hashedPw, role: "admin",         phone: "+91 98765 43210", city: "Varanasi"   },
    { name: "Pt. Ram Kripal",    email: "temple1@example.com",    password: hashedPw, role: "temple_owner",  phone: "+91 87654 32109", city: "Varanasi"   },
    { name: "Smt. Kamla Devi",   email: "temple2@example.com",    password: hashedPw, role: "temple_owner",  phone: "+91 76543 21098", city: "Mathura"    },
    { name: "Acharya Suresh",    email: "temple3@example.com",    password: hashedPw, role: "temple_owner",  phone: "+91 65432 10987", city: "Ujjain"     },
    { name: "Priya Agarwal",     email: "user1@example.com",      password: hashedPw, role: "user",          phone: "+91 98001 00001", city: "Delhi"      },
    { name: "Rajesh Mehta",      email: "user2@example.com",      password: hashedPw, role: "user",          phone: "+91 98001 00002", city: "Mumbai"     },
  ]);
  console.log("👤 Created 6 users");

  // Temples
  const [t1, t2, t3] = await Temple.insertMany([
    {
      name: "Shri Kashi Vishwanath Mandir", slug: "kashi-vishwanath",
      shortDescription: "One of the twelve Jyotirlingas, dedicated to Lord Shiva in the holy city of Varanasi.",
      description:      "The Kashi Vishwanath Temple is one of the most famous Hindu temples dedicated to Lord Shiva. It is located in Varanasi, Uttar Pradesh and is one of the twelve Jyotirlinga shrines.",
      deity: "Lord Shiva", status: "approved", featured: true, owner: owner1._id,
      location: { address: "Vishwanath Gali, Varanasi", city: "Varanasi", state: "Uttar Pradesh", pincode: "221001", lat: 25.3109, lng: 83.0104 },
      coverImage: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800",
      images: ["https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800"],
      timings: "3:00 AM – 11:00 PM", established: "1780",
      contactPhone: "+91 98765 43210", contactEmail: "info@kashivishwanath.org",
      tags: ["jyotirlinga", "shiva", "varanasi", "ancient"],
      totalBookings: 2400, rating: 4.9, reviewCount: 1230,
    },
    {
      name: "Shri Banke Bihari Mandir", slug: "banke-bihari-mathura",
      shortDescription: "Sacred Vaishnava temple of Lord Krishna in the holy city of Mathura.",
      description: "Banke Bihari temple is a famous Hindu temple of Lord Krishna in the holy city of Vrindavan, Mathura.",
      deity: "Lord Krishna", status: "approved", featured: true, owner: owner2._id,
      location: { address: "Banke Bihari Marg, Vrindavan", city: "Mathura", state: "Uttar Pradesh", pincode: "281121", lat: 27.5770, lng: 77.6988 },
      coverImage: "https://images.unsplash.com/photo-1623059982558-f0ee0c3c1a40?w=800",
      images: ["https://images.unsplash.com/photo-1623059982558-f0ee0c3c1a40?w=800"],
      timings: "7:45 AM – 9:00 PM", established: "1864",
      contactPhone: "+91 91234 56789", contactEmail: "info@bankebihari.org",
      tags: ["krishna", "vrindavan", "mathura", "vaishnava"],
      totalBookings: 1800, rating: 4.8, reviewCount: 890,
    },
    {
      name: "Mahakaleshwar Jyotirlinga", slug: "mahakaleshwar-ujjain",
      shortDescription: "The Mahakaleshwar temple, one of the twelve Jyotirlingas, situated in Ujjain.",
      description: "Mahakaleshwar Temple is a Hindu temple dedicated to Shiva located in Ujjain, Madhya Pradesh. One of the twelve Jyotirlingas, the most sacred abodes of Shiva.",
      deity: "Lord Shiva", status: "approved", featured: true, owner: owner3._id,
      location: { address: "Jaisinghpura, Ujjain", city: "Ujjain", state: "Madhya Pradesh", pincode: "456001", lat: 23.1822, lng: 75.7683 },
      coverImage: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800",
      images: ["https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800"],
      timings: "4:00 AM – 11:00 PM", established: "6th century",
      contactPhone: "+91 73422 55555", contactEmail: "info@mahakaleshwar.org",
      tags: ["jyotirlinga", "shiva", "ujjain", "bhasmarti"],
      totalBookings: 3100, rating: 4.9, reviewCount: 2100,
    },
  ]);
  console.log("🛕 Created 3 featured temples");

  // Pujas
  await Puja.insertMany([
    { name: "Rudrabhishek",    nameHi: "रुद्राभिषेक",    price: 2100, duration: "2 hours",   temple: t1._id, description: "Sacred ritual bathing of Shiva Lingam",    descriptionHi: "शिव लिंग का पवित्र अभिषेक",  image: "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?w=400", benefits: ["Removes sins", "Grants moksha"],          benefitsHi: ["पापों का नाश", "मोक्ष की प्राप्ति"], includes: ["Abhishek", "Aarti", "Prasad"], totalBooked: 450 },
    { name: "Satyanarayan",   nameHi: "सत्यनारायण कथा", price: 1100, duration: "3 hours",   temple: t1._id, description: "Auspicious Vishnu puja for blessings",      descriptionHi: "भगवान विष्णु की पूजा",            image: "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?w=400", benefits: ["Prosperity", "Family harmony"],           benefitsHi: ["समृद्धि", "परिवार में सुख"],          includes: ["Katha", "Aarti", "Prasad"],   totalBooked: 320 },
    { name: "Navgrah Puja",   nameHi: "नवग्रह पूजा",    price: 3100, duration: "4 hours",   temple: t2._id, description: "Puja to please all nine planets",           descriptionHi: "नौ ग्रहों की शांति के लिए पूजा", image: "https://images.unsplash.com/photo-1612432516893-4e34c32bd10c?w=400", benefits: ["Planetary peace", "Remove doshas"],       benefitsHi: ["ग्रह दोष निवारण"],                    includes: ["Havan", "Aarti", "Yantra"],   totalBooked: 180 },
    { name: "Mahamrityunjaya", nameHi: "महामृत्युंजय",  price: 5100, duration: "5 hours",   temple: t3._id, description: "Powerful Shiva mantra for health & longevity",descriptionHi: "दीर्घायु व स्वास्थ्य के लिए पूजा",image: "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?w=400", benefits: ["Health", "Protection from death"],        benefitsHi: ["स्वास्थ्य", "दीर्घायु"],              includes: ["Jap", "Havan", "Prasad"],     totalBooked: 290 },
    { name: "Bhasma Aarti",   nameHi: "भस्म आरती",      price: 500,  duration: "45 minutes", temple: t3._id, description: "Rare early morning aarti with sacred ash",  descriptionHi: "पवित्र भस्म से भव्य आरती",        image: "https://images.unsplash.com/photo-1612432516893-4e34c32bd10c?w=400", benefits: ["Blessings of Mahakal"],                   benefitsHi: ["महाकाल का आशीर्वाद"],                 includes: ["Entry", "Darshan"],           totalBooked: 800 },
  ]);
  console.log("📿 Created 5 pujas");

  // Chadawa
  await Chadawa.insertMany([
    { name: "Bilva Patra Offering",    nameHi: "बेलपत्र अर्पण",  price: 151,  deity: "Lord Shiva",   temple: t1._id, description: "108 Bilva leaves offered to Shiva Linga",    descriptionHi: "शिव लिंग पर 108 बेलपत्र अर्पण", items: ["108 Bilva leaves", "Gangajal", "Sindoor"], image: "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?w=400" },
    { name: "Panchamrit Abhishek",     nameHi: "पंचामृत अभिषेक", price: 501,  deity: "Lord Shiva",   temple: t1._id, description: "Ritual bathing with five sacred substances",  descriptionHi: "पाँच पवित्र पदार्थों से अभिषेक",  items: ["Milk", "Curd", "Honey", "Ghee", "Sugar"],  image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=400" },
    { name: "Tulsi Mala Offering",     nameHi: "तुलसी माला अर्पण",price: 251,  deity: "Lord Krishna", temple: t2._id, description: "Sacred tulsi garland offering to Lord Krishna", descriptionHi: "श्री कृष्ण को तुलसी माला अर्पण",  items: ["Tulsi mala", "Flowers", "Mishri"],          image: "https://images.unsplash.com/photo-1623059982558-f0ee0c3c1a40?w=400" },
    { name: "Makhan Mishri Bhog",      nameHi: "माखन मिश्री भोग", price: 301,  deity: "Lord Krishna", temple: t2._id, description: "Krishna's favourite sweet butter offering",    descriptionHi: "बाल गोपाल का प्रिय माखन भोग",     items: ["Makhan", "Mishri", "Fruits", "Panjiri"],    image: "https://images.unsplash.com/photo-1623059982558-f0ee0c3c1a40?w=400" },
  ]);
  console.log("🌸 Created 4 chadawa items");

  // Bookings
  const pujas = await Puja.find().limit(2);
  await Booking.insertMany([
    { user: user1._id, temple: t1._id, service: pujas[0]._id, serviceType: "puja", serviceName: "Rudrabhishek",  serviceNameHi: "रुद्राभिषेक",  amount: 2100, devoteeName: "Priya Agarwal",  gotra: "Bharadwaj", date: new Date("2026-05-15"), status: "confirmed",  paymentStatus: "paid",   orderId: "order_001", paymentId: "pay_001" },
    { user: user2._id, temple: t2._id, service: pujas[1]._id, serviceType: "puja", serviceName: "Satyanarayan", serviceNameHi: "सत्यनारायण",  amount: 1100, devoteeName: "Rajesh Mehta",   gotra: "Kashyap",   date: new Date("2026-05-20"), status: "pending",    paymentStatus: "paid",   orderId: "order_002", paymentId: "pay_002" },
    { user: user1._id, temple: t3._id, service: pujas[0]._id, serviceType: "puja", serviceName: "Bhasma Aarti", serviceNameHi: "भस्म आरती",   amount: 500,  devoteeName: "Priya Agarwal",  gotra: "Bharadwaj", date: new Date("2026-06-01"), status: "completed",  paymentStatus: "paid",   orderId: "order_003", paymentId: "pay_003" },
  ]);
  console.log("📋 Created 3 bookings");

  // Blogs
  await Blog.insertMany([
    {
      title: "The Sacred Significance of Rudrabhishek", titleHi: "रुद्राभिषेक का पवित्र महत्व",
      slug: "significance-of-rudrabhishek",
      excerpt: "Discover the deep spiritual meaning behind Rudrabhishek — the sacred bathing ritual of Lord Shiva.", excerptHi: "रुद्राभिषेक के गहन आध्यात्मिक महत्व को जानें।",
      content: "<p>Rudrabhishek is one of the most important rituals in Shaivism...</p>",
      contentHi: "<p>रुद्राभिषेक शैवधर्म का एक महत्वपूर्ण अनुष्ठान है...</p>",
      coverImage: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800",
      author: admin._id, category: "devotional", status: "published", isAdminFeatured: true,
      publishedAt: new Date(), tags: ["rudrabhishek", "shiva", "ritual"], views: 320,
    },
    {
      title: "Kashi Vishwanath: The Eternal City's Soul", titleHi: "काशी विश्वनाथ: अनंत नगरी की आत्मा",
      slug: "kashi-vishwanath-eternal-city",
      excerpt: "A journey through the spiritual heart of Varanasi — the timeless Kashi Vishwanath temple.", excerptHi: "वाराणसी के आध्यात्मिक केंद्र काशी विश्वनाथ की यात्रा।",
      content: "<p>Standing on the banks of the Ganges for over 3500 years...</p>",
      contentHi: "<p>गंगा के तट पर 3500 से अधिक वर्षों से खड़ा...</p>",
      coverImage: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800",
      author: owner1._id, temple: t1._id, category: "temple-story", status: "published", isAdminFeatured: true,
      publishedAt: new Date(), tags: ["kashi", "varanasi", "temple-story"], views: 450,
    },
    {
      title: "Ekadashi Fasting: A Complete Guide", titleHi: "एकादशी व्रत: एक संपूर्ण मार्गदर्शिका",
      slug: "ekadashi-fasting-guide",
      excerpt: "Everything you need to know about Ekadashi fasting — significance, rules, and blessings.", excerptHi: "एकादशी व्रत के बारे में सब कुछ — महत्व, नियम और आशीर्वाद।",
      content: "<p>Ekadashi is the eleventh day of every lunar fortnight...</p>",
      contentHi: "<p>एकादशी हर चंद्र पखवाड़े का ग्यारहवाँ दिन है...</p>",
      coverImage: "https://images.unsplash.com/photo-1612432516893-4e34c32bd10c?w=800",
      author: admin._id, category: "festival", status: "published", isAdminFeatured: true,
      publishedAt: new Date(), tags: ["ekadashi", "fasting", "vishnu"], views: 280,
    },
  ]);
  console.log("📝 Created 3 blogs");

  // Ads
  await Ad.insertMany([
    {
      title: "Book Navratri Special Puja",
      imageUrl: "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?w=1200",
      linkUrl: "/puja?filter=navratri",
      placement: "hero",
      isActive: true,
      startDate: new Date("2026-01-01"),
      endDate:   new Date("2026-12-31"),
      createdBy: admin._id,
    },
    {
      title: "Chadawa Special Offer",
      imageUrl: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600",
      linkUrl: "/chadawa",
      placement: "sidebar",
      isActive: true,
      startDate: new Date("2026-01-01"),
      endDate:   new Date("2026-12-31"),
      createdBy: admin._id,
    },
  ]);
  console.log("📢 Created 2 ads");

  console.log("\n✅ Seed complete!");
  console.log("📧 Admin:   admin@epoojapaath.com / password123");
  console.log("📧 Owner 1: temple1@example.com / password123");
  console.log("📧 User 1:  user1@example.com / password123");
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
