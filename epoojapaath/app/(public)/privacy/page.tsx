import { PublicPage } from "@/components/shared/PublicPage";

export default function PrivacyPage() {
  return (
    <PublicPage>
      <div className="pt-4 min-h-screen bg-gradient-to-b from-background to-card-bg">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-lotus-pink/15 via-lotus-purple/10 to-lotus-blue/15 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="w-full h-full bg-[radial-gradient(circle_at_center,#EC9DD4_0%,transparent_70%)]" />
          </div>
          <div className="relative z-10 max-w-4xl mx-auto px-4">
            <h1 className="font-heading text-4xl md:text-5xl text-foreground mb-4">Privacy Policy</h1>
            <p className="text-saffron font-medium text-sm">Last Updated: June 2026</p>
          </div>
        </section>

        {/* Policy Content */}
        <section className="py-12 max-w-4xl mx-auto px-4 md:px-8">
          <div className="card-devotional p-6 md:p-10 space-y-8 text-muted-foreground leading-relaxed">
            
            <p className="text-lg">
              Welcome to ePoojapaath (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how ePoojapaath collects, uses, stores, and protects your information when you use our website, mobile applications, and related services.
            </p>

            <hr className="border-white/10" />

            {/* Section 1 */}
            <div>
              <h2 className="font-heading text-xl text-foreground mb-4">1. Information We Collect</h2>
              <p className="mb-4">We may collect the following information:</p>
              
              <div className="space-y-4 pl-4 border-l-2 border-saffron/30">
                <div>
                  <h3 className="text-foreground font-semibold mb-1 text-base">Personal Information</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Full Name</li>
                    <li>Email Address</li>
                    <li>Mobile Number</li>
                    <li>Postal Address (Optional)</li>
                    <li>Gotra, Nakshatra, and other details required for performing pujas (optional)</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-foreground font-semibold mb-1 text-base">Transaction Information</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Puja booking details</li>
                    <li>Temple and offering selections</li>
                    <li>Donation details</li>
                    <li>Payment transaction references</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-foreground font-semibold mb-1 text-base">Technical Information</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>IP address</li>
                    <li>Browser type and device information</li>
                    <li>Cookies and usage data</li>
                    <li>Website activity and preferences</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div>
              <h2 className="font-heading text-xl text-foreground mb-3">2. How We Use Your Information</h2>
              <p className="mb-2">We use your information to:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Process puja bookings and religious services</li>
                <li>Coordinate with temples and priests for ritual performance</li>
                <li>Deliver prasadam and religious offerings</li>
                <li>Send booking confirmations and service updates</li>
                <li>Provide customer support</li>
                <li>Improve website functionality and user experience</li>
                <li>Comply with legal and regulatory obligations</li>
              </ul>
            </div>

            {/* Section 3 */}
            <div>
              <h2 className="font-heading text-xl text-foreground mb-3">3. Information Sharing</h2>
              <p className="mb-3">
                We do not sell, rent, or trade your personal information.
              </p>
              <p className="mb-2">Information may be shared only with:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Authorized temples and priests for conducting booked rituals</li>
                <li>Payment gateway providers for processing transactions</li>
                <li>Logistics partners for delivering prasadam and offerings</li>
                <li>Government authorities when required by law</li>
              </ul>
              <p className="mt-3 text-sm italic">
                All third-party partners are expected to maintain appropriate confidentiality and security standards.
              </p>
            </div>

            {/* Section 4 */}
            <div>
              <h2 className="font-heading text-xl text-foreground mb-3">4. Payment Security</h2>
              <p>
                ePoojapaath does not store your debit card, credit card, UPI PIN, or banking credentials. Payments are processed through secure third-party payment gateways that comply with applicable security standards.
              </p>
            </div>

            {/* Section 5 */}
            <div>
              <h2 className="font-heading text-xl text-foreground mb-3">5. Cookies</h2>
              <p className="mb-2">We may use cookies and similar technologies to:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Remember user preferences</li>
                <li>Improve website performance</li>
                <li>Analyze website traffic</li>
                <li>Enhance user experience</li>
              </ul>
              <p className="mt-3">
                Users may disable cookies through their browser settings; however, certain website features may not function properly.
              </p>
            </div>

            {/* Section 6 */}
            <div>
              <h2 className="font-heading text-xl text-foreground mb-3">6. Data Protection</h2>
              <p>
                We implement reasonable technical and organizational measures to safeguard personal information against unauthorized access, misuse, alteration, disclosure, or destruction. While we strive to protect your information, no internet transmission can be guaranteed to be completely secure.
              </p>
            </div>

            {/* Section 7 */}
            <div>
              <h2 className="font-heading text-xl text-foreground mb-3">7. User Rights</h2>
              <p className="mb-2">You may:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Access your personal information</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your account, subject to legal obligations</li>
                <li>Withdraw consent for marketing communications</li>
              </ul>
              <p className="mt-3">
                Requests may be submitted through our customer support channels.
              </p>
            </div>

            {/* Section 8 */}
            <div>
              <h2 className="font-heading text-xl text-foreground mb-3">8. Religious Services Disclaimer</h2>
              <p>
                Puja outcomes, spiritual benefits, blessings, and religious experiences are matters of individual faith and belief. ePoojapaath does not guarantee any specific spiritual, financial, health, or personal outcome from any ritual or religious service.
              </p>
            </div>

            {/* Section 9 */}
            <div>
              <h2 className="font-heading text-xl text-foreground mb-3">9. Children&apos;s Privacy</h2>
              <p>
                Our services are not directed toward children under the age of 18 without parental or guardian supervision.
              </p>
            </div>

            {/* Section 10 */}
            <div>
              <h2 className="font-heading text-xl text-foreground mb-3">10. Changes to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy periodically. Updated versions will be published on this page along with the revised effective date.
              </p>
            </div>

            {/* Section 11 */}
            <div>
              <h2 className="font-heading text-xl text-foreground mb-3">11. Contact Us</h2>
              <p className="mb-2">For privacy-related concerns, questions, or requests, please contact:</p>
              <div className="bg-saffron/5 border border-saffron/10 rounded-xl p-4 text-foreground text-sm space-y-1">
                <p className="font-bold text-base">ePoojapaath</p>
                <p><span className="text-muted-foreground">Email:</span> <a href="mailto:support@epoojapaath.com" className="text-saffron hover:underline">support@epoojapaath.com</a></p>
                <p><span className="text-muted-foreground">Website:</span> <a href="https://www.epoojapaath.com" target="_blank" rel="noopener noreferrer" className="text-saffron hover:underline">www.epoojapaath.com</a></p>
              </div>
            </div>

            <hr className="border-white/10" />

            <p className="text-center text-sm italic text-muted-foreground/60">
              By using ePoojapaath, you agree to the collection and use of information as described in this Privacy Policy.
            </p>

          </div>
        </section>
      </div>
    </PublicPage>
  );
}
