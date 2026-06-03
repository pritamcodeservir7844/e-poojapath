import { PublicPage } from "@/components/shared/PublicPage";

export default function TermsPage() {
  return (
    <PublicPage>
      <div className="pt-4 min-h-screen bg-gradient-to-b from-background to-card-bg">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-lotus-pink/15 via-lotus-purple/10 to-lotus-blue/15 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="w-full h-full bg-[radial-gradient(circle_at_center,#EC9DD4_0%,transparent_70%)]" />
          </div>
          <div className="relative z-10 max-w-4xl mx-auto px-4">
            <h1 className="font-heading text-4xl md:text-5xl text-foreground mb-4">Terms of Service</h1>
            <p className="text-saffron font-medium text-sm">Effective Date: June 2026</p>
          </div>
        </section>

        {/* Terms Content */}
        <section className="py-12 max-w-4xl mx-auto px-4 md:px-8">
          <div className="card-devotional p-6 md:p-10 space-y-8 text-muted-foreground leading-relaxed">
            
            <p className="text-lg">
              Welcome to ePoojapaath. These Terms of Service (&quot;Terms&quot;) govern your access to and use of the ePoojapaath website, mobile applications, and related services (collectively, the &quot;Platform&quot;). By accessing or using our Platform, you agree to be bound by these Terms.
            </p>

            <hr className="border-white/10" />

            {/* Section 1 */}
            <div>
              <h2 className="font-heading text-xl text-foreground mb-3">1. About ePoojapaath</h2>
              <p>
                ePoojapaath is a platform that facilitates the booking of pujas, religious rituals, temple offerings, prasadam delivery, donations, and other spiritual services through associated temples, priests, and service providers.
              </p>
            </div>

            {/* Section 2 */}
            <div>
              <h2 className="font-heading text-xl text-foreground mb-3">2. User Eligibility</h2>
              <p className="mb-2">By using the Platform, you confirm that:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>You are at least 18 years of age or using the Platform under parental supervision.</li>
                <li>You have the legal capacity to enter into binding agreements.</li>
                <li>The information provided by you is accurate and complete.</li>
              </ul>
            </div>

            {/* Section 3 */}
            <div>
              <h2 className="font-heading text-xl text-foreground mb-3">3. Account Registration</h2>
              <p className="mb-3">
                Users may be required to create an account for certain services.
              </p>
              <p className="mb-2">You agree to:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Provide accurate information.</li>
                <li>Maintain the confidentiality of your login credentials.</li>
                <li>Accept responsibility for activities conducted through your account.</li>
              </ul>
              <p className="mt-3">
                ePoojapaath reserves the right to suspend or terminate accounts that provide false information or misuse the Platform.
              </p>
            </div>

            {/* Section 4 */}
            <div>
              <h2 className="font-heading text-xl text-foreground mb-3">4. Puja and Religious Services</h2>
              <div className="space-y-4 pl-4 border-l-2 border-saffron/30">
                <div>
                  <h3 className="text-foreground font-semibold mb-1 text-base">Service Nature</h3>
                  <p className="text-sm">
                    ePoojapaath acts as a facilitator between devotees, temples, priests, and service providers.
                  </p>
                </div>
                <div>
                  <h3 className="text-foreground font-semibold mb-1 text-base">Ritual Performance</h3>
                  <p className="text-sm">
                    Pujas and rituals are conducted according to the customs, traditions, and procedures followed by the respective temple or priest.
                  </p>
                </div>
                <div>
                  <h3 className="text-foreground font-semibold mb-1 text-base">Devotional Disclaimer</h3>
                  <p className="text-sm">
                    Religious rituals, blessings, and spiritual outcomes are matters of faith. ePoojapaath does not guarantee any specific spiritual, personal, financial, medical, or life outcome from any puja or ritual.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 5 */}
            <div>
              <h2 className="font-heading text-xl text-foreground mb-3">5. Bookings and Payments</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>All prices displayed are subject to change without prior notice.</li>
                <li>Payment must be completed before confirmation of services.</li>
                <li>Booking confirmations will be communicated through email, SMS, WhatsApp, or the Platform.</li>
                <li>Users are responsible for providing accurate details for puja performance and delivery requirements.</li>
              </ul>
            </div>

            {/* Section 6 */}
            <div>
              <h2 className="font-heading text-xl text-foreground mb-3">6. Cancellation and Refund Policy</h2>
              <div className="space-y-3">
                <div>
                  <h3 className="text-foreground font-semibold mb-1 text-base">Puja Services</h3>
                  <p>Once a puja has been performed, no refund shall be issued.</p>
                </div>
                <div>
                  <h3 className="text-foreground font-semibold mb-1 text-base">Cancellation Requests</h3>
                  <p className="mb-2">Refund eligibility depends on:</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Stage of processing</li>
                    <li>Temple-specific policies</li>
                    <li>Procurement of ritual materials</li>
                  </ul>
                  <p className="mt-2 text-sm">Approved refunds may be processed after deducting applicable charges and transaction fees.</p>
                </div>
                <div>
                  <h3 className="text-foreground font-semibold mb-1 text-base">Force Majeure</h3>
                  <p>
                    Services may be delayed, rescheduled, or cancelled due to circumstances beyond reasonable control, including natural disasters, government restrictions, temple closures, strikes, or emergencies.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 7 */}
            <div>
              <h2 className="font-heading text-xl text-foreground mb-3">7. Donations</h2>
              <p>
                Donations made through the Platform are forwarded to the designated temple, trust, or religious institution. Once successfully transferred, donations are generally non-refundable unless otherwise required by law.
              </p>
            </div>

            {/* Section 8 */}
            <div>
              <h2 className="font-heading text-xl text-foreground mb-3">8. Prasadam and Physical Deliveries</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Delivery timelines are estimates only.</li>
                <li>Delays caused by courier partners, weather conditions, or regional restrictions are beyond our control.</li>
                <li>Users must provide accurate delivery information.</li>
              </ul>
              <p className="mt-3">
                ePoojapaath shall not be responsible for failed deliveries caused by incorrect information supplied by users.
              </p>
            </div>

            {/* Section 9 */}
            <div>
              <h2 className="font-heading text-xl text-foreground mb-3">9. Intellectual Property</h2>
              <p className="mb-3">
                All content available on the Platform, including text, images, logos, designs, videos, software, and branding, is the property of ePoojapaath or its licensors and is protected by applicable intellectual property laws.
              </p>
              <p>
                Users may not copy, reproduce, distribute, modify, or exploit Platform content without prior written permission.
              </p>
            </div>

            {/* Section 10 */}
            <div>
              <h2 className="font-heading text-xl text-foreground mb-3">10. Prohibited Activities</h2>
              <p className="mb-2">Users agree not to:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Violate any applicable laws.</li>
                <li>Misrepresent personal information.</li>
                <li>Interfere with Platform operations.</li>
                <li>Upload harmful software or malicious code.</li>
                <li>Engage in fraudulent activities.</li>
                <li>Use the Platform for unauthorized commercial purposes.</li>
              </ul>
            </div>

            {/* Section 11 */}
            <div>
              <h2 className="font-heading text-xl text-foreground mb-3">11. Limitation of Liability</h2>
              <p className="mb-3">
                To the maximum extent permitted by law:
              </p>
              <p className="mb-3">
                ePoojapaath, its founders, employees, priests, temples, partners, and affiliates shall not be liable for any indirect, incidental, consequential, special, or punitive damages arising from the use of the Platform or religious services.
              </p>
              <p>
                Our total liability shall not exceed the amount paid by the user for the specific service giving rise to the claim.
              </p>
            </div>

            {/* Section 12 */}
            <div>
              <h2 className="font-heading text-xl text-foreground mb-3">12. Privacy</h2>
              <p>
                Your use of the Platform is also governed by our Privacy Policy, which explains how personal information is collected, used, and protected.
              </p>
            </div>

            {/* Section 13 */}
            <div>
              <h2 className="font-heading text-xl text-foreground mb-3">13. Third-Party Services</h2>
              <p>
                The Platform may integrate with third-party services including payment gateways, logistics providers, messaging services, and external websites. We are not responsible for the policies, practices, or actions of third-party service providers.
              </p>
            </div>

            {/* Section 14 */}
            <div>
              <h2 className="font-heading text-xl text-foreground mb-3">14. Modification of Terms</h2>
              <p>
                ePoojapaath reserves the right to modify these Terms at any time. Updated Terms shall become effective upon publication on the Platform. Continued use of the Platform constitutes acceptance of the revised Terms.
              </p>
            </div>

            {/* Section 15 */}
            <div>
              <h2 className="font-heading text-xl text-foreground mb-3">15. Governing Law and Jurisdiction</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising from the use of the Platform shall be subject to the exclusive jurisdiction of the competent courts in Agartala, Tripura, India.
              </p>
            </div>

            {/* Section 16 */}
            <div>
              <h2 className="font-heading text-xl text-foreground mb-3">16. Contact Information</h2>
              <p className="mb-2">For questions regarding these Terms, please contact:</p>
              <div className="bg-saffron/5 border border-saffron/10 rounded-xl p-4 text-foreground text-sm space-y-1">
                <p className="font-bold text-base">ePoojapaath</p>
                <p><span className="text-muted-foreground">Email:</span> <a href="mailto:support@epoojapaath.com" className="text-saffron hover:underline">support@epoojapaath.com</a></p>
                <p><span className="text-muted-foreground">Website:</span> <a href="https://www.epoojapaath.com" target="_blank" rel="noopener noreferrer" className="text-saffron hover:underline">www.epoojapaath.com</a></p>
              </div>
            </div>

            <hr className="border-white/10" />

            <p className="text-center text-sm italic text-muted-foreground/60">
              By accessing or using ePoojapaath, you acknowledge that you have read, understood, and agreed to these Terms of Service.
            </p>

          </div>
        </section>
      </div>
    </PublicPage>
  );
}
