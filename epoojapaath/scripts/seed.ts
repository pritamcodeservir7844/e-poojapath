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
    { name: "Admin Sharma", email: "admin@epoojapaath.com", password: hashedPw, role: "admin", phone: "+91 98765 43210", city: "Varanasi" },
    { name: "Pt. Ram Kripal", email: "temple1@example.com", password: hashedPw, role: "temple_owner", phone: "+91 87654 32109", city: "Varanasi" },
    { name: "Smt. Kamla Devi", email: "temple2@example.com", password: hashedPw, role: "temple_owner", phone: "+91 76543 21098", city: "Mathura" },
    { name: "Acharya Suresh", email: "temple3@example.com", password: hashedPw, role: "temple_owner", phone: "+91 65432 10987", city: "Ujjain" },
    { name: "Priya Agarwal", email: "user1@example.com", password: hashedPw, role: "user", phone: "+91 98001 00001", city: "Delhi" },
    { name: "Rajesh Mehta", email: "user2@example.com", password: hashedPw, role: "user", phone: "+91 98001 00002", city: "Mumbai" },
  ]);
  console.log("👤 Created 6 users");

  // Temples
  const [t1, t2, t3] = await Temple.insertMany([
    {
      name: "Tripura Sundari Temple",
      slug: "tripura-sundari",
      shortDescription: "One of the Sacred 51 Shakti Peethas of India dedicated to Goddess Tripura Sundari (Maa Kali).",
      description: "Tripura Sundari Temple is situated in the ancient city of Udaipur, about 55 km from Agartala, Tripura. It is believed to be one of the 51 Shakti Peethas, where the right foot of Goddess Sati fell. Built by Maharaja Dhanya Manikya in 1501, the temple is popularly known as Matabari.",
      deity: "Maa Tripura Sundari",
      status: "approved",
      featured: true,
      owner: admin._id,
      location: { address: "Udaipur, Tripura", city: "Udaipur", state: "Tripura", pincode: "799120", lat: 23.5048, lng: 91.4986 },
      coverImage: "/tripura-sundari.jpg",
      images: ["/tripura-sundari.jpg"],
      timings: "6:00 AM – 9:00 PM",
      established: "1501 AD",
      contactPhone: "+91 3821 223 555",
      contactEmail: "info@tripurasundari.org",
      tags: ["shakti-peetha", "devi", "tripura", "ancient"],
      totalBookings: 2400,
      rating: 5.0,
      reviewCount: 35,
    },
    {
      name: "Kasbeswari Kali Temple",
      slug: "kasbeswari-kali",
      shortDescription: "Revered spiritual destination dedicated to Goddess Kali, known as Maa Kasbeswari, built in the 17th century.",
      description: "Kasbeswari Kali Temple (also known as Kasba Kalibari) is situated on a hillock overlooking the Kamlasagar lake in Tripura. Built in the 17th century by Maharaja Kalyan Manikya, the deity is worshipped in the form of Kali, similar to the image of Goddess Durga.",
      deity: "Goddess Kali",
      status: "approved",
      featured: true,
      owner: admin._id,
      location: { address: "Kasba, Tripura", city: "Kasba", state: "Tripura", pincode: "799102", lat: 23.6300, lng: 91.3500 },
      coverImage: "/kasbeswari.jpg",
      images: ["/kasbeswari.jpg"],
      timings: "6:00 AM – 8:30 PM",
      established: "17th century",
      contactPhone: "+91 3821 224 666",
      contactEmail: "info@kasbeswarikali.org",
      tags: ["kali", "devi", "tripura", "historical"],
      totalBookings: 1800,
      rating: 4.9,
      reviewCount: 12,
    },
    {
      name: "Tripuresh Bhairav Temple",
      slug: "tripuresh-bhairav",
      shortDescription: "Revered Shiva temple in Tripura dedicated to Baba Tripuresh Bhairav, the guardian deity of Maa Tripura Sundari.",
      description: "Tripuresh Bhairav Temple is a historic Shiva temple located near the Tripura Sundari Temple in Udaipur, Tripura. It is dedicated to Lord Shiva in his Bhairav form, revered as the guardian deity of Goddess Tripura Sundari.",
      deity: "Lord Shiva",
      status: "approved",
      featured: true,
      owner: admin._id,
      location: { address: "Udaipur, Tripura", city: "Udaipur", state: "Tripura", pincode: "799120", lat: 23.5060, lng: 91.4990 },
      coverImage: "/tripuresh-bhairav.jpg",
      images: ["/tripuresh-bhairav.jpg"],
      timings: "5:30 AM – 9:00 PM",
      established: "16th century",
      contactPhone: "+91 3821 223 777",
      contactEmail: "info@tripureshbhairav.org",
      tags: ["shiva", "bhairav", "tripura", "guardian"],
      totalBookings: 3100,
      rating: 4.8,
      reviewCount: 9,
    },
  ]);
  console.log("🛕 Created 3 featured temples");

  // Schedule helpers — relative to seed run time
  const inHours = (h: number) => new Date(Date.now() + h * 60 * 60 * 1000);

  const COMMON_FAQS = [
    { question: "Why choose us for online Puja booking?", answer: "We are a trusted Sanatan spiritual platform enabling devotees to book pujas at ancient temples across India. Our experienced pandits perform every puja in Shubh Muhurat with full Vedic rituals." },
    { question: "Will I receive a recording of the Puja?", answer: "Yes! After the puja, a recorded video is provided. Post-puja, bhaktibox and aarti-prasad are delivered to the devotee's doorstep." },
    { question: "What should I do if I don't know my Gotra?", answer: "You can mention 'Kashyap Gotra' as the universal gotra, or simply leave it blank — the pandit will use the common lineage." },
    { question: "Is online puja equally powerful as in-person puja?", answer: "Absolutely. The Vedic tradition recognises Sankalp (intention) as the key — physical presence is not mandatory." },
  ];

  // Pujas
  await Puja.insertMany([
    {
      name: "Maa Tripura Sundari Maha Puja & Havan",
      nameHi: "मां त्रिपुरसुंदरी महा पूजा और हवन",
      price: 2100,
      duration: "2 to 2.5 hours",
      temple: t1._id,
      description: "Perform the holy Maha Puja and Havan dedicated to Goddess Tripura Sundari to invoke her divine protection, health, and prosperity. The puja includes path, havan, and offering of red hibiscus flowers.",
      descriptionHi: "मां त्रिपुरसुंदरी की दिव्य कृपा, स्वास्थ्य और समृद्धि के लिए महा पूजा और हवन।",
      image: "/tripura-sundari.jpg",
      benefits: ["Brings happiness and prosperity", "Protects from negative energies", "Improves health and wellness"],
      benefitsHi: ["सुख-समृद्धि की प्राप्ति", "नकारात्मक ऊर्जा से रक्षा", "स्वास्थ्य लाभ"],
      includes: ["Ganesh Puja", "Devi Path", "Havan", "Aarti", "Prasad delivery"],
      packages: [
        { label: "Single", persons: "For 1 person", price: 2100, maxPersons: 1 },
        { label: "Two People", persons: "Upto 2 people", price: 3100, maxPersons: 2 },
        { label: "Family", persons: "Upto 4 people", price: 4100, maxPersons: 4 },
      ],
      scheduledAt: inHours(2),
      rating: 5.0,
      reviewCount: 35,
      totalBooked: 240,
      faqs: COMMON_FAQS,
    },
    {
      name: "Chandi Path & Havan",
      nameHi: "चंडी पाठ और हवन",
      price: 5100,
      duration: "4 hours",
      temple: t1._id,
      description: "Sacred Chandi Path recitation and Havan for removal of obstacles, victory over enemies, and overall spiritual upliftment.",
      descriptionHi: "बाधाओं को दूर करने और आध्यात्मिक उन्नति के लिए पवित्र चंडी पाठ और हवन।",
      image: "/tripura-sundari.jpg",
      benefits: ["Removes hurdles and delays", "Grants power and confidence", "Brings peace and harmony"],
      benefitsHi: ["बाधाएं दूर होती हैं", "शक्ति और आत्मविश्वास में वृद्धि", "शांति और सद्भाव"],
      includes: ["Durga Saptashati Path", "Maha Havan", "Kanya Pujan", "Prasad delivery"],
      packages: [
        { label: "Single", persons: "For 1 person", price: 5100, maxPersons: 1 },
        { label: "Family", persons: "Upto 4 people", price: 7500, maxPersons: 4 },
        { label: "Grand", persons: "Upto 8 people", price: 11000, maxPersons: 8 },
      ],
      scheduledAt: inHours(5),
      rating: 4.9,
      reviewCount: 18,
      totalBooked: 110,
      faqs: COMMON_FAQS,
    },
    {
      name: "Maha Kali Puja & Pushpanjali",
      nameHi: "महा काली पूजा और पुष्पांजलि",
      price: 1500,
      duration: "1.5 hours",
      temple: t2._id,
      description: "Seek the blessings of Goddess Kali at the historic Kasbeswari Kali Temple. This puja is performed for courage, elimination of fear, and protection from evil.",
      descriptionHi: "साहस, भय से मुक्ति और बुराई से सुरक्षा के लिए मां काली की विशेष पूजा।",
      image: "/kasbeswari.jpg",
      benefits: ["Grants strength and fearlessness", "Neutralizes enemies and ill-effects", "Protects family from obstacles"],
      benefitsHi: ["शक्ति और निर्भयता", "शत्रु बाधा शांति", "परिवार की रक्षा"],
      includes: ["Kali Puja", "Pushpanjali", "Aarti", "Special Bhog offering"],
      packages: [
        { label: "Single", persons: "For 1 person", price: 1500, maxPersons: 1 },
        { label: "Two People", persons: "Upto 2 people", price: 2100, maxPersons: 2 },
        { label: "Family", persons: "Upto 4 people", price: 3500, maxPersons: 4 },
      ],
      scheduledAt: inHours(1),
      rating: 4.9,
      reviewCount: 12,
      totalBooked: 95,
      faqs: COMMON_FAQS,
    },
    {
      name: "Rudrabhishek Puja",
      nameHi: "रुद्राभिषेक पूजा",
      price: 2500,
      duration: "2 hours",
      temple: t3._id,
      description: "Rudrabhishek is the sacred ritual of bathing the Shiva Lingam with milk, honey, curd, and sugarcane juice while chanting Vedic mantras. It is performed for peace, prosperity, and removal of planetary doshas.",
      descriptionHi: "सुख-शांति और ग्रह दोष शांति के लिए शिव लिंग का पवित्र रुद्राभिषेक।",
      image: "/tripuresh-bhairav.jpg",
      benefits: ["Removes negative karma", "Improves financial stability", "Brings mental peace and health"],
      benefitsHi: ["नकारात्मक कर्मों का नाश", "आर्थिक स्थिरता", "मानसिक शांति"],
      includes: ["Rudrabhishek", "Panchamrit Abhishek", "Bilva Patra offering", "Aarti", "Prasad delivery"],
      packages: [
        { label: "Single", persons: "For 1 person", price: 2500, maxPersons: 1 },
        { label: "Family", persons: "Upto 4 people", price: 4500, maxPersons: 4 },
      ],
      scheduledAt: inHours(3),
      rating: 4.8,
      reviewCount: 9,
      totalBooked: 70,
      faqs: COMMON_FAQS,
    },
  ]);
  console.log("📿 Created 4 pujas with packages, timers & FAQs");

  // Chadawa
  await Chadawa.insertMany([
    {
      name: "Maa Tripurasundari Shringar & Bhog Offering",
      nameHi: "मां त्रिपुरसुंदरी श्रृंगार और भोग अर्पण",
      price: 501,
      deity: "Maa Tripura Sundari",
      temple: t1._id,
      description: "Traditional Shringar and Bhog offering to Goddess Tripura Sundari including saree, chunari, coconut, fruits, and flowers.",
      descriptionHi: "मां त्रिपुरसुंदरी को साड़ी, चुनरी, नारियल, फल और फूलों सहित पारंपरिक श्रृंगार और भोग अर्पण।",
      image: "/tripura-sundari.jpg",
      items: ["Flower Basket Small", "Red Hibiscus Flower Mala", "Deep Daan", "Peda Prasad", "Coconut", "Chunari", "Saree", "Sindoor", "Divine Aashirbad Box", "Dakshina to Pandit Ji"],
      offeringItems: [
        { name: "Flower Basket Small", nameHi: "फूल टोकरी छोटी", price: 51, image: "/red-hibiscus-mala.jpg", description: "Fresh flowers" },
        { name: "Red Hibiscus Flower Mala", nameHi: "लाल गुड़हल फूल माला", price: 101, image: "/red-hibiscus-mala.jpg", description: "Mala for Devi" },
        { name: "Deep Daan", nameHi: "दीप दान", price: 31, image: "/tripura-sundari.jpg", description: "Clay lamps" },
        { name: "Peda Prasad", nameHi: "पेड़ा प्रसाद", price: 101, image: "/peda-prasad.jpg", description: "Milk sweets" },
        { name: "Coconut", nameHi: "नारियल", price: 41, image: "/coconut.jpg", description: "Fresh coconut" },
        { name: "Chunari", nameHi: "चुनरी", price: 51, image: "/chunari.jpg", description: "Red chunari" },
        { name: "Saree", nameHi: "साड़ी", price: 251, image: "/red-saree.jpg", description: "Red saree for deity" },
        { name: "Sindoor", nameHi: "सिंडूर", price: 21, image: "/sindoor-bowl.jpg", description: "Sacred vermillion" },
        { name: "Divine Aashirbad Box", nameHi: "दिव्य आशीर्वाद बॉक्स", price: 151, image: "/tripura-sundari.jpg", description: "Blessings box" },
        { name: "Dakshina to Pandit Ji", nameHi: "पंडित जी को दक्षिणा", price: 101, image: "/tripura-sundari.jpg", description: "Dakshina" },
      ],
    },
    {
      name: "Special Chadawa",
      nameHi: "विशेष चढ़ावा",
      price: 1100,
      deity: "Maa Tripura Sundari",
      temple: t1._id,
      description: "Grand special offering to Maa Tripura Sundari including lotus basket, red hibiscus mala, saree, suhaag shringar items, and khichudi prasad seva.",
      descriptionHi: "मां त्रिपुरसुंदरी को कमल टोकरी, लाल गुड़हल माला, साड़ी, सुहाग श्रृंगार और खिचड़ी प्रसाद सेवा सहित भव्य विशेष अर्पण।",
      image: "/tripura-sundari.jpg",
      items: ["Red Flowers & Lotus Basket", "Red Hibiscus Flower Mala", "Peda Prasad & Coconut Offering", "Saree", "Offer Nine Suhaag Shringar Items", "Tripura Sundari Maa Mangalmay Poojan Bhet", "Sacred Khichudi Prasad Seva"],
      offeringItems: [
        { name: "Red Flowers & Lotus Basket", nameHi: "लाल फूल और कमल टोकरी", price: 151, image: "/red-hibiscus-mala.jpg", description: "Lotus flowers basket" },
        { name: "Red Hibiscus Flower Mala", nameHi: "लाल गुड़हल फूल माला", price: 101, image: "/red-hibiscus-mala.jpg", description: "Goddess garland" },
        { name: "Peda Prasad & Coconut Offering", nameHi: "पेड़ा प्रसाद और नारियल अर्पण", price: 151, image: "/peda-prasad.jpg", description: "Bhog offering" },
        { name: "Saree", nameHi: "साड़ी", price: 301, image: "/red-saree.jpg", description: "Saree offering" },
        { name: "Offer Nine Suhaag Shringar Items", nameHi: "नौ सुहाग श्रृंगार सामग्री अर्पण", price: 201, image: "/poojan-bhet.jpg", description: "Suhaag kit" },
        { name: "Tripura Sundari Maa Mangalmay Poojan Bhet", nameHi: "त्रिपुर सुंदरी मां मंगलमय पूजन भेंट", price: 501, image: "/poojan-bhet.jpg", description: "Pujan bhet" },
        { name: "Sacred Khichudi Prasad Seva", nameHi: "पवित्र खिचड़ी प्रसाद सेवा", price: 251, image: "/coconut-thali.jpg", description: "Khichudi prasad" },
      ],
    },
    {
      name: "Maa Kasbeswari Kali Shringar Bhog",
      nameHi: "मां कस्बेश्वरी काली श्रृंगार भोग",
      price: 351,
      deity: "Goddess Kali",
      temple: t2._id,
      description: "Shringar and Prasad bhog offering for Goddess Kasbeswari Kali.",
      descriptionHi: "देवी कस्बेश्वरी काली के लिए श्रृंगार और प्रसाद भोग अर्पण।",
      image: "/kasbeswari.jpg",
      items: ["Red Hibiscus Garland", "Coconut", "Peda Prasad", "Sindoor"],
      offeringItems: [
        { name: "Red Hibiscus Garland", nameHi: "लाल गुड़हल माला", price: 101, image: "/red-hibiscus-mala.jpg", description: "Red hibiscus flower mala" },
        { name: "Coconut", nameHi: "नारियल", price: 41, image: "/coconut.jpg", description: "Pure coconut" },
        { name: "Peda Prasad", nameHi: "पेड़ा प्रसाद", price: 101, image: "/peda-prasad.jpg", description: "Milk pedas" },
        { name: "Sindoor", nameHi: "सिंडूर", price: 21, image: "/sindoor-bowl.jpg", description: "Sindoor" },
        { name: "Chunari", nameHi: "चुनरी", price: 51, image: "/chunari.jpg", description: "Devi chunari" },
      ],
    },
    {
      name: "Bhairav Puja Offering Thali",
      nameHi: "भैरव पूजा अर्पण थाली",
      price: 251,
      deity: "Lord Shiva",
      temple: t3._id,
      description: "Special offering thali for Tripuresh Bhairav.",
      descriptionHi: "त्रिपुरेश भैरव के लिए विशेष अर्पण थाली।",
      image: "/tripuresh-bhairav.jpg",
      items: ["Bilva leaves", "Coconut", "White Flowers Garland", "Bhasma"],
      offeringItems: [
        { name: "Bilva Patra (108 leaves)", nameHi: "बेलपत्र (108 पत्ते)", price: 51, image: "/tripuresh-bhairav.jpg", description: "Bilva leaves" },
        { name: "Coconut", nameHi: "नारियल", price: 41, image: "/coconut.jpg", description: "Pure coconut" },
        { name: "White Flowers Garland", nameHi: "सफेद फूल माला", price: 61, image: "/red-hibiscus-mala.jpg", description: "White flowers garland" },
        { name: "Bhasma", nameHi: "भस्म", price: 51, image: "/tripuresh-bhairav.jpg", description: "Sacred ash" },
        { name: "Gangajal", nameHi: "गंगाजल", price: 31, image: "/tripuresh-bhairav.jpg", description: "Holy Ganga water" },
      ],
    },
  ]);
  console.log("🌸 Created 4 chadawa offerings");

  // Bookings
  const pujas = await Puja.find().limit(2);
  await Booking.insertMany([
    { user: user1._id, temple: t1._id, service: pujas[0]._id, serviceType: "puja", serviceName: pujas[0].name, serviceNameHi: pujas[0].nameHi, amount: pujas[0].price, devoteeName: "Priya Agarwal", gotra: "Bharadwaj", date: new Date("2026-05-15"), status: "confirmed", paymentStatus: "paid", orderId: "order_001", paymentId: "pay_001" },
    { user: user2._id, temple: t1._id, service: pujas[1]._id, serviceType: "puja", serviceName: pujas[1].name, serviceNameHi: pujas[1].nameHi, amount: pujas[1].price, devoteeName: "Rajesh Mehta", gotra: "Kashyap", date: new Date("2026-05-20"), status: "pending", paymentStatus: "paid", orderId: "order_002", paymentId: "pay_002" },
    { user: user1._id, temple: t2._id, service: pujas[0]._id, serviceType: "puja", serviceName: pujas[0].name, serviceNameHi: pujas[0].nameHi, amount: pujas[0].price, devoteeName: "Priya Agarwal", gotra: "Bharadwaj", date: new Date("2026-06-01"), status: "completed", paymentStatus: "paid", orderId: "order_003", paymentId: "pay_003" },
  ]);
  console.log("📋 Created 3 bookings");

  // Blogs
  await Blog.insertMany([
    {
      title: "The Divine Power of Goddess Tripura Sundari",
      titleHi: "देवी त्रिपुरसुंदरी की दिव्य शक्ति",
      slug: "divine-power-of-tripura-sundari",
      excerpt: "Explore the history and spiritual significance of the Tripura Sundari Shakti Peetha in Udaipur, Tripura.",
      excerptHi: "उदयपुर, त्रिपुरा में त्रिपुर सुंदरी शक्ति पीठ के इतिहास और आध्यात्मिक महत्व का अन्वेषण करें।",
      content: "<p>Tripura Sundari Temple is one of the most revered Shakti shrines in India...</p>",
      contentHi: "<p>त्रिपुर सुंदरी मंदिर भारत में सबसे पूजनीय शक्ति पीठों में से एक है...</p>",
      coverImage: "/tripura-sundari.jpg",
      author: admin._id,
      category: "devotional",
      status: "published",
      isAdminFeatured: true,
      publishedAt: new Date(),
      tags: ["tripura-sundari", "shakti-peetha", "devi"],
      views: 320,
    },
    {
      title: "Kamlasagar Kasbeswari Kali Temple: A Historical Journey",
      titleHi: "कमलासागर कस्बेश्वरी काली मंदिर: एक ऐतिहासिक यात्रा",
      slug: "kasbeswari-kali-temple-history",
      excerpt: "A look into the 17th-century Kasbeswari Kali temple overlooking the border lake of Kamlasagar.",
      excerptHi: "कमलासागर के सीमावर्ती झील के किनारे स्थित 17वीं सदी के कस्बेश्वरी काली मंदिर पर एक नज़र।",
      content: "<p>Located on a scenic hillock, the Kasbeswari temple has stood for centuries...</p>",
      contentHi: "<p>एक सुरम्य पहाड़ी पर स्थित, कस्बेश्वरी मंदिर सदियों से खड़ा है...</p>",
      coverImage: "/kasbeswari.jpg",
      author: admin._id,
      temple: t2._id,
      category: "temple-story",
      status: "published",
      isAdminFeatured: true,
      publishedAt: new Date(),
      tags: ["kasbeswari", "tripura", "temple-story"],
      views: 450,
    },
  ]);
  console.log("📝 Created 2 blogs");

  // Ads
  await Ad.insertMany([
    {
      title: "Book Navratri Special Puja",
      imageUrl: "/ad_poojapath_banner.png",
      linkUrl: "/puja?filter=navratri",
      placement: "hero",
      isActive: true,
      startDate: new Date("2026-01-01"),
      endDate: new Date("2026-12-31"),
      createdBy: admin._id,
    },
    {
      title: "Chadawa Special Offer",
      imageUrl: "/tripura-sundari.jpg",
      linkUrl: "/chadawa",
      placement: "sidebar",
      isActive: true,
      startDate: new Date("2026-01-01"),
      endDate: new Date("2026-12-31"),
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

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
