const TITHIS = ["Pratipada","Dwitiya","Tritiya","Chaturthi","Panchami","Shashthi","Saptami","Ashtami","Navami","Dashami","Ekadashi","Dwadashi","Trayodashi","Chaturdashi","Purnima/Amavasya"];
const NAKSHATRAS = ["Ashwini","Bharani","Krittika","Rohini","Mrigashira","Ardra","Punarvasu","Pushya","Ashlesha","Magha","Purva Phalguni","Uttara Phalguni","Hasta","Chitra","Swati","Vishakha","Anuradha","Jyeshtha","Mula","Purva Ashadha","Uttara Ashadha","Shravana","Dhanishtha","Shatabhisha","Purva Bhadrapada","Uttara Bhadrapada","Revati"];
const YOGAS = ["Vishkambha","Priti","Ayushman","Saubhagya","Shobhana","Atiganda","Sukarma","Dhriti","Shula","Ganda","Vriddhi","Dhruva","Vyaghata","Harshana","Vajra","Siddhi","Vyatipata","Variyan","Parigha","Shiva","Siddha","Sadhya","Shubha","Shukla","Brahma","Indra","Vaidhriti"];
const KARANAS = ["Bava","Balava","Kaulava","Taitila","Garija","Vanija","Vishti","Bhadra","Shakuni","Chatushpada","Naga","Kimstughna"];
const VARAS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

const RAHU_KAAL: Record<number, string> = {
  0: "4:30 PM – 6:00 PM",
  1: "7:30 AM – 9:00 AM",
  2: "3:00 PM – 4:30 PM",
  3: "12:00 PM – 1:30 PM",
  4: "1:30 PM – 3:00 PM",
  5: "10:30 AM – 12:00 PM",
  6: "9:00 AM – 10:30 AM",
};

function dayOfYear(date: Date): number {
  return Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
}

export function getPanchang(date: Date) {
  const doy = dayOfYear(date);
  const dow = date.getDay();
  return {
    tithi:           TITHIS[doy % 15],
    vara:            VARAS[dow],
    nakshatra:       NAKSHATRAS[doy % 27],
    yoga:            YOGAS[doy % 27],
    karana:          KARANAS[doy % 11],
    rahuKaal:        RAHU_KAAL[dow],
    abhijitMuhurat:  "11:47 AM – 12:36 PM",
  };
}

const RASHIFAL_READINGS: Record<string, string[]> = {
  aries:       ["A day of new beginnings. Focus on self-improvement and take bold steps forward.", "Divine energy surrounds you. Channel your enthusiasm into productive tasks."],
  taurus:      ["Financial gains are indicated. Stay grounded and trust your instincts.", "A peaceful day. Spend time in prayer and gratitude."],
  gemini:      ["Communication flows naturally. Resolve pending matters with clarity.", "New connections bring opportunities. Be open to collaboration."],
  cancer:      ["Family harmony is highlighted. A great day for prayers and rituals at home.", "Emotions run deep. Use this sensitivity to strengthen relationships."],
  leo:         ["Leadership opportunities arise. Step forward with confidence and grace.", "Creative energy peaks. Express yourself through devotion and art."],
  virgo:       ["Attention to detail serves you well. Complete pending tasks systematically.", "Health improvements are indicated. Include pranayama in your routine."],
  libra:       ["Balance is your strength today. Avoid extreme decisions.", "Partnerships flourish. Seek harmony in all interactions."],
  scorpio:     ["Deep transformation is underway. Trust the divine process.", "Hidden truths reveal themselves. Welcome the clarity."],
  sagittarius: ["Knowledge and wisdom are your guides today. Seek learning.", "A spiritually charged day. Visit a temple or engage in meditation."],
  capricorn:   ["Professional success is within reach. Stay disciplined.", "Long-term goals show progress. Persist with faith."],
  aquarius:    ["Humanitarian impulses are strong. Serve others and be rewarded.", "Innovation brings solutions. Think creatively and fearlessly."],
  pisces:      ["Intuition is powerful today. Trust your inner voice.", "Spiritual connections deepen. Engage in mantra chanting."],
};

const LUCKY_COLORS = ["Saffron","Golden","White","Red","Green","Blue","Yellow","Purple","Pink","Orange","Cream","Silver"];
const TIMES = ["6:00 AM – 8:00 AM","8:30 AM – 10:00 AM","11:00 AM – 12:30 PM","2:00 PM – 3:30 PM","5:00 PM – 6:30 PM"];

export function getRashifal(rashi: string) {
  const today = new Date();
  const seed = today.getDay() + today.getDate();
  const readings = RASHIFAL_READINGS[rashi] || RASHIFAL_READINGS.aries;
  return {
    reading:       readings[seed % readings.length],
    luckyColor:    LUCKY_COLORS[seed % LUCKY_COLORS.length],
    luckyNumber:   (seed % 9) + 1,
    auspiciousTime:TIMES[seed % TIMES.length],
  };
}

const NUMEROLOGY_TRAITS: Record<number, string> = {
  1: "Natural leader, independent, ambitious, and self-reliant. You are destined for greatness through self-expression.",
  2: "Cooperative, diplomatic, and sensitive. You thrive in partnerships and bring harmony wherever you go.",
  3: "Creative, expressive, and joyful. Your artistic nature and optimism uplift everyone around you.",
  4: "Practical, disciplined, and trustworthy. You build lasting foundations through hard work and dedication.",
  5: "Adventurous, versatile, and freedom-loving. Change and exploration bring you growth and fulfillment.",
  6: "Nurturing, responsible, and compassionate. Family and community are your greatest strengths.",
  7: "Introspective, spiritual, and analytical. You seek deeper truths and excel in philosophical pursuits.",
  8: "Powerful, ambitious, and success-oriented. Material and spiritual abundance align in your path.",
  9: "Humanitarian, wise, and selfless. You are here to serve a higher purpose and inspire the world.",
};

export function getNumerology(name: string) {
  const total = name.toLowerCase().replace(/[^a-z]/g, "").split("").reduce((sum, ch) => sum + (ch.charCodeAt(0) - 96), 0);
  let lifePathNumber = total;
  while (lifePathNumber > 9) lifePathNumber = String(lifePathNumber).split("").reduce((s, d) => s + Number(d), 0);
  return {
    lifePathNumber,
    traits:      NUMEROLOGY_TRAITS[lifePathNumber] || NUMEROLOGY_TRAITS[1],
    luckyNumbers: [lifePathNumber, (lifePathNumber + 3) % 9 || 9, (lifePathNumber + 6) % 9 || 9],
  };
}

const AUSPICIOUS_TITHIS: Record<string, number[]> = {
  "marriage":        [2,3,5,7,10,11,13],
  "griha-pravesh":   [2,3,5,10,11],
  "naming-ceremony": [2,3,5,7,12],
  "business":        [2,3,5,10,11,12],
  "travel":          [2,3,5,7,10,12,13],
};

export function getMuhurats(eventType: string, from: Date, to?: Date) {
  const end = to || new Date(from.getTime() + 30 * 86400000);
  const goodTithis = AUSPICIOUS_TITHIS[eventType] || AUSPICIOUS_TITHIS.business;
  const results: { date: string; time: string; tithi: string }[] = [];
  const cur = new Date(from);
  while (cur <= end && results.length < 5) {
    const doy = dayOfYear(cur);
    const tithi = doy % 15;
    if (goodTithis.includes(tithi + 1) && cur.getDay() !== 0) {
      results.push({
        date:  cur.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),
        time:  TIMES[doy % TIMES.length],
        tithi: TITHIS[tithi],
      });
    }
    cur.setDate(cur.getDate() + 1);
  }
  return results;
}
