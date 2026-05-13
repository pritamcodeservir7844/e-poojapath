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

  // Schedule helpers — relative to seed run time
  const inHours = (h: number) => new Date(Date.now() + h * 60 * 60 * 1000);

  const COMMON_FAQS = [
    { question: "Why choose us for online Puja booking?", answer: "We are a trusted Sanatan spiritual platform enabling devotees to book pujas at ancient temples across India. Our experienced pandits perform every puja in Shubh Muhurat with full Vedic rituals." },
    { question: "Will I receive a recording of the Puja?", answer: "Yes! After the puja, a recorded video is provided. Post-puja, bhakti box and aarti-wad are delivered to the devotee's doorstep." },
    { question: "What should I do if I don't know my Gotra?", answer: "You can mention 'Kashyap Gotra' as the universal gotra, or simply leave it blank — the pandit will use the common lineage." },
    { question: "Is online puja equally powerful as in-person puja?", answer: "Absolutely. The Vedic tradition recognises Sankalp (intention) as the key — physical presence is not mandatory." },
  ];

  // Pujas
  await Puja.insertMany([
    {
      name: "Rudrabhishek", nameHi: "रुद्राभिषेक",
      price: 2100, duration: "2 to 2.5 hours", temple: t1._id,
      description: "Rudrabhishek is the sacred ritual bathing of the Shiva Lingam with Panchamrit, Gangajal, milk, and honey while chanting the Rudrashtadhyayi. This deeply purifying puja removes sins, calms the mind, and attracts divine blessings of Lord Shiva.",
      descriptionHi: "रुद्राभिषेक शिव लिंग का पंचामृत, गंगाजल, दूध और शहद से पवित्र अभिषेक है जो रुद्राष्टाध्यायी के पाठ के साथ किया जाता है।",
      image: "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?w=800",
      benefits: ["Removes sins and negative karma", "Grants moksha and liberation", "Improves health and longevity", "Brings peace and prosperity to family"],
      benefitsHi: ["पापों का नाश", "मोक्ष की प्राप्ति", "स्वास्थ्य लाभ", "परिवार में सुख-शांति"],
      includes: ["Rudrabhishek", "Panchamrit Abhishek", "Bilva Patra Offering", "Aarti", "Prasad delivery"],
      packages: [
        { label: "Single",     persons: "For 1 person",  price: 2100, maxPersons: 1 },
        { label: "Two People", persons: "Upto 2 people", price: 3100, maxPersons: 2 },
        { label: "Family",     persons: "Upto 4 people", price: 4100, maxPersons: 4 },
        { label: "Family+",    persons: "Upto 6 people", price: 5100, maxPersons: 6 },
      ],
      scheduledAt: inHours(2),   // ← timer: starts in ~2 hours
      rating: 4.9, reviewCount: 1230, totalBooked: 450,
      faqs: COMMON_FAQS,
    },
    {
      name: "Satyanarayan Katha", nameHi: "सत्यनारायण कथा",
      price: 1100, duration: "3 hours", temple: t1._id,
      description: "Satyanarayan Puja is performed in honour of Lord Vishnu to invoke his blessings for prosperity, harmony and success. The katha narrates divine stories of Lord Satyanarayan that bring fortune and remove obstacles from devotees' lives.",
      descriptionHi: "सत्यनारायण पूजा भगवान विष्णु की कृपा पाने के लिए की जाती है। यह पूजा समृद्धि और सुख-शांति के लिए परिवारों द्वारा आयोजित की जाती है।",
      image: "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?w=800",
      benefits: ["Brings prosperity and wealth", "Removes obstacles from life", "Strengthens family bonds", "Fulfils wishes and desires"],
      benefitsHi: ["समृद्धि और धन लाभ", "जीवन की बाधाएं दूर होती हैं", "परिवार में सुख"],
      includes: ["Satyanarayan Katha", "Panchamrit Abhishek", "Aarti", "Prasad & Panchamrit"],
      packages: [
        { label: "Single",     persons: "For 1 person",  price: 1100, maxPersons: 1 },
        { label: "Two People", persons: "Upto 2 people", price: 1601, maxPersons: 2 },
        { label: "Family",     persons: "Upto 4 people", price: 2101, maxPersons: 4 },
        { label: "Family+",    persons: "Upto 6 people", price: 2801, maxPersons: 6 },
      ],
      scheduledAt: inHours(5),   // ← timer: starts in ~5 hours
      rating: 4.7, reviewCount: 890, totalBooked: 320,
      faqs: COMMON_FAQS,
    },
    {
      name: "Navgrah Shanti Puja", nameHi: "नवग्रह पूजा",
      price: 3100, duration: "4 hours", temple: t2._id,
      description: "Navgrah Shanti Puja is performed to pacify all nine planets and neutralise their malefic effects. The ritual includes specific mantras, havan, and offerings for each planet to bring balance, peace, and positive planetary energies into one's life.",
      descriptionHi: "नवग्रह शांति पूजा नौ ग्रहों को शांत करने और उनके नकारात्मक प्रभाव को दूर करने के लिए की जाती है।",
      image: "https://images.unsplash.com/photo-1612432516893-4e34c32bd10c?w=800",
      benefits: ["Pacifies all nine planets", "Removes kundli doshas", "Improves career and business", "Brings overall life balance"],
      benefitsHi: ["ग्रह दोष निवारण", "कुंडली दोष शांति", "करियर में उन्नति"],
      includes: ["Navgrah Havan", "Yantra", "Nine Planet Offerings", "Aarti", "Prasad"],
      packages: [
        { label: "Single",     persons: "For 1 person",  price: 3100, maxPersons: 1 },
        { label: "Two People", persons: "Upto 2 people", price: 4500, maxPersons: 2 },
        { label: "Family",     persons: "Upto 4 people", price: 5500, maxPersons: 4 },
        { label: "Family+",    persons: "Upto 6 people", price: 7100, maxPersons: 6 },
      ],
      scheduledAt: inHours(1),   // ← timer: starts in ~1 hour
      rating: 4.8, reviewCount: 540, totalBooked: 180,
      faqs: COMMON_FAQS,
    },
    {
      name: "Mahamrityunjaya Jap", nameHi: "महामृत्युंजय जाप",
      price: 5100, duration: "5 hours", temple: t3._id,
      description: "Mahamrityunjaya Jap involves 1,25,000 chantings of the powerful Mahamrityunjaya mantra — the great death-conquering mantra of Lord Shiva. It is performed for health, healing, protection from accidents, and long life.",
      descriptionHi: "महामृत्युंजय जाप में भगवान शिव के महामंत्र का 1,25,000 बार जप किया जाता है। यह स्वास्थ्य, दीर्घायु और सुरक्षा के लिए किया जाता है।",
      image: "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?w=800",
      benefits: ["Conquers disease and illness", "Protection from accidents", "Grants long and healthy life", "Relieves fear and anxiety"],
      benefitsHi: ["रोग से मुक्ति", "दुर्घटना से सुरक्षा", "दीर्घायु प्राप्ति"],
      includes: ["1,25,000 Mantra Jap", "Havan", "Abhishek", "Prasad delivery", "Video recording"],
      packages: [
        { label: "Single",     persons: "For 1 person",  price: 5100, maxPersons: 1 },
        { label: "Two People", persons: "Upto 2 people", price: 7100, maxPersons: 2 },
        { label: "Family",     persons: "Upto 4 people", price: 9100, maxPersons: 4 },
        { label: "Family+",    persons: "Upto 6 people", price: 11100, maxPersons: 6 },
      ],
      scheduledAt: inHours(3),   // ← timer: starts in ~3 hours
      rating: 4.9, reviewCount: 720, totalBooked: 290,
      faqs: COMMON_FAQS,
    },
    {
      name: "Bhasma Aarti", nameHi: "भस्म आरती",
      price: 500, duration: "45 minutes", temple: t3._id,
      description: "Bhasma Aarti is the rare and sacred early morning ritual at Mahakaleshwar Ujjain where the deity is adorned with sacred ash (bhasma). This is one of the most sought-after spiritual experiences, performed only at Mahakaleshwar temple.",
      descriptionHi: "भस्म आरती महाकालेश्वर उज्जैन का एक दुर्लभ और पवित्र प्रातःकालीन अनुष्ठान है जिसमें देवता को पवित्र भस्म से अलंकृत किया जाता है।",
      image: "https://images.unsplash.com/photo-1612432516893-4e34c32bd10c?w=800",
      benefits: ["Rare darshan of Mahakal", "Liberation from the cycle of death", "Powerful spiritual awakening", "Divine blessings of Lord Mahakal"],
      benefitsHi: ["महाकाल का दुर्लभ दर्शन", "मृत्यु के चक्र से मुक्ति", "आध्यात्मिक जागरण"],
      includes: ["Live Bhasma Aarti participation", "Special darshan", "Prasad"],
      packages: [
        { label: "Single",     persons: "For 1 person",  price: 500,  maxPersons: 1 },
        { label: "Two People", persons: "Upto 2 people", price: 851,  maxPersons: 2 },
        { label: "Family",     persons: "Upto 4 people", price: 1251, maxPersons: 4 },
        { label: "Family+",    persons: "Upto 6 people", price: 1801, maxPersons: 6 },
      ],
      scheduledAt: inHours(0.5), // ← timer: starts in ~30 minutes
      rating: 5.0, reviewCount: 2100, totalBooked: 800,
      faqs: COMMON_FAQS,
    },
  ]);
  console.log("📿 Created 5 pujas with packages, timers & FAQs");

  const SHIVA_IMG  = "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?w=400";
  const TEMPLE_IMG = "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=400";
  const KRISHNA_IMG= "https://images.unsplash.com/photo-1623059982558-f0ee0c3c1a40?w=400";
  const FLOWER_IMG = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400";
  const FRUIT_IMG  = "https://images.unsplash.com/photo-1582515073490-39981397c445?w=400";

  // Chadawa
  await Chadawa.insertMany([
    {
      name: "Bilva Patra Offering", nameHi: "बेलपत्र अर्पण", price: 151,
      deity: "Lord Shiva", temple: t1._id,
      description: "108 Bilva leaves offered to Shiva Linga with Gangajal and Sindoor. Bilva patra is the most sacred offering to Lord Shiva, believed to fulfil wishes and remove sins.",
      descriptionHi: "शिव लिंग पर 108 बेलपत्र, गंगाजल और सिंदूर से अर्पण। बेलपत्र भगवान शिव को सबसे प्रिय है।",
      image: SHIVA_IMG,
      items: ["108 Bilva leaves", "Gangajal", "Sindoor", "Dhatura flowers"],
      offeringItems: [
        { name: "Bilva Patra (108 leaves)", nameHi: "बेलपत्र (108 पत्ते)", price: 51,  image: SHIVA_IMG,  description: "108 fresh bilva leaves" },
        { name: "Gangajal",                  nameHi: "गंगाजल",              price: 31,  image: TEMPLE_IMG, description: "Sacred Ganga water" },
        { name: "Sindoor",                   nameHi: "सिंदूर",               price: 21,  image: FLOWER_IMG, description: "Sacred vermillion" },
        { name: "Dhatura Flowers",           nameHi: "धतूरा फूल",           price: 41,  image: FLOWER_IMG, description: "White dhatura flowers" },
        { name: "Bhasma",                    nameHi: "भस्म",                price: 51,  image: SHIVA_IMG,  description: "Sacred ash offering" },
        { name: "White Flowers Garland",     nameHi: "सफेद फूल माला",       price: 61,  image: FLOWER_IMG, description: "Fresh white flower garland" },
      ],
    },
    {
      name: "Panchamrit Abhishek", nameHi: "पंचामृत अभिषेक", price: 501,
      deity: "Lord Shiva", temple: t1._id,
      description: "Ritual bathing of the Shiva Linga with five sacred substances — milk, curd, honey, ghee and sugar water. Each substance carries a specific divine blessing.",
      descriptionHi: "पाँच पवित्र पदार्थों — दूध, दही, शहद, घी और शक्कर — से शिव लिंग का अभिषेक।",
      image: TEMPLE_IMG,
      items: ["Milk", "Curd", "Honey", "Ghee", "Sugar"],
      offeringItems: [
        { name: "Milk Abhishek",   nameHi: "दूध अभिषेक",  price: 101, image: TEMPLE_IMG, description: "Pure cow milk" },
        { name: "Curd Abhishek",   nameHi: "दही अभिषेक",  price: 81,  image: TEMPLE_IMG, description: "Fresh curd" },
        { name: "Honey Abhishek",  nameHi: "शहद अभिषेक",  price: 121, image: FLOWER_IMG, description: "Pure honey" },
        { name: "Ghee Abhishek",   nameHi: "घी अभिषेक",   price: 151, image: TEMPLE_IMG, description: "Pure cow ghee" },
        { name: "Sugar Water",     nameHi: "शक्कर जल",    price: 51,  image: TEMPLE_IMG, description: "Sweet sugar water" },
        { name: "Rose Petals",     nameHi: "गुलाब पंखुड़ी", price: 71,  image: FLOWER_IMG, description: "Fresh rose petals" },
      ],
    },
    {
      name: "Tulsi Mala Offering", nameHi: "तुलसी माला अर्पण", price: 251,
      deity: "Lord Krishna", temple: t2._id,
      description: "Sacred tulsi garland offering to Lord Krishna. Tulsi is the most beloved plant of Lord Vishnu and Krishna — offering it brings immense divine grace.",
      descriptionHi: "श्री कृष्ण को तुलसी माला अर्पण। तुलसी भगवान विष्णु की प्रिय है, इसका अर्पण अत्यंत पुण्यकारी है।",
      image: KRISHNA_IMG,
      items: ["Tulsi mala", "Flowers", "Mishri", "Panchamrit"],
      offeringItems: [
        { name: "Tulsi Mala",         nameHi: "तुलसी माला",     price: 81,  image: KRISHNA_IMG, description: "108-bead tulsi garland" },
        { name: "Yellow Flowers",     nameHi: "पीले फूल",        price: 51,  image: FLOWER_IMG,  description: "Fresh yellow marigolds" },
        { name: "Mishri (Rock Sugar)",nameHi: "मिश्री",          price: 41,  image: FRUIT_IMG,   description: "Rock sugar offering" },
        { name: "Panchamrit Bhog",    nameHi: "पंचामृत भोग",     price: 101, image: KRISHNA_IMG, description: "Five nectar offering" },
        { name: "Makhan Bhog",        nameHi: "माखन भोग",        price: 61,  image: FRUIT_IMG,   description: "Butter offering" },
        { name: "Panjiri Prasad",     nameHi: "पंजीरी प्रसाद",   price: 51,  image: FRUIT_IMG,   description: "Sweet wheat prasad" },
      ],
    },
    {
      name: "Makhan Mishri Bhog", nameHi: "माखन मिश्री भोग", price: 301,
      deity: "Lord Krishna", temple: t2._id,
      description: "Krishna's favourite sweet butter offering. Makhan Mishri Bhog is the most beloved offering to Bal Gopal — it symbolises the playful, innocent devotion that Krishna loves most.",
      descriptionHi: "बाल गोपाल का प्रिय माखन भोग। माखन मिश्री श्री कृष्ण को अत्यंत प्रिय है।",
      image: KRISHNA_IMG,
      items: ["Makhan", "Mishri", "Fruits", "Panjiri"],
      offeringItems: [
        { name: "Makhan (Butter)",  nameHi: "माखन",           price: 101, image: FRUIT_IMG,   description: "Fresh hand-churned butter" },
        { name: "Mishri",           nameHi: "मिश्री",          price: 51,  image: FRUIT_IMG,   description: "Crystal rock sugar" },
        { name: "Seasonal Fruits",  nameHi: "मौसमी फल",        price: 121, image: FRUIT_IMG,   description: "Fresh seasonal fruit platter" },
        { name: "Panjiri",          nameHi: "पंजीरी",          price: 71,  image: FRUIT_IMG,   description: "Roasted wheat sweet" },
        { name: "Chappan Bhog",     nameHi: "छप्पन भोग",       price: 251, image: KRISHNA_IMG, description: "56-item grand offering" },
        { name: "Tulsi Dal",        nameHi: "तुलसी दल",        price: 41,  image: FLOWER_IMG,  description: "Fresh tulsi leaves" },
      ],
    },
  ]);
  console.log("🌸 Created 4 chadawa items with offering items");

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
