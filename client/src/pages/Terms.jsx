import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Section = ({ title, children }) => (
  <div className="mb-10">
    <h2 className="text-xl font-bold text-navy mb-3">{title}</h2>
    <div className="text-gray-600 text-sm leading-relaxed space-y-3">{children}</div>
  </div>
);

export default function Terms() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1">
        <div className="page-container py-16 max-w-3xl mx-auto">

          <div className="mb-10">
            <p className="text-sky-500 font-bold text-xs uppercase tracking-[0.12em] mb-2">Legal</p>
            <h1 className="heading-lg text-navy mb-3">Terms of Service &amp; Platform Disclaimer</h1>
            <p className="text-gray-400 text-sm">Last updated: June 2026</p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-10 text-sm text-amber-800 leading-relaxed">
            <strong>Summary:</strong> BidRinse is a marketplace that connects homeowners with independent cleaning businesses.
            We are not a cleaning company, we do not employ the businesses on our platform, and we are not a party to any
            agreement between a customer and a business. By using BidRinse you acknowledge and accept the terms below.
          </div>

          <Section title="1. What BidRinse Is">
            <p>
              BidRinse, LLC ("BidRinse," "we," "us," or "our") operates an online marketplace platform that allows
              homeowners and property owners ("Customers") to post exterior cleaning jobs and receive competing price
              quotes from independent cleaning businesses ("Businesses"). BidRinse itself does not perform any cleaning
              or other services.
            </p>
            <p>
              BidRinse is not a cleaning company. The Businesses listed on our platform are independent third-party
              contractors. They are not employees, agents, or representatives of BidRinse in any manner. BidRinse has
              no control over and does not direct the work performed by any Business.
            </p>
          </Section>

          <Section title="2. Platform Role Only — No Liability for Work">
            <p>
              BidRinse's sole role is to provide a technology platform that facilitates introductions between Customers
              and Businesses. Once a Customer accepts a quote and a Business begins work, the agreement for services is
              exclusively between that Customer and that Business. BidRinse is not a party to that agreement.
            </p>
            <p>
              BidRinse makes no representations, warranties, or guarantees — express or implied — regarding the quality,
              timeliness, safety, legality, or completion of any work performed by a Business. BidRinse shall not be
              held responsible or liable for:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>Work that is incomplete, unsatisfactory, or not performed to your expectations</li>
              <li>Property damage caused during or after a job</li>
              <li>Personal injury arising from a Business's work</li>
              <li>Disputes over pricing, scope of work, or completion status</li>
              <li>A Business's failure to honor a quoted price</li>
              <li>Any conduct, action, or omission of a Business before, during, or after a job</li>
            </ul>
            <p>
              Any dispute regarding work quality, scope, payment, or any other matter must be resolved directly between
              the Customer and the Business. BidRinse has no obligation to mediate or resolve disputes between the
              parties, though we may assist at our sole discretion.
            </p>
          </Section>

          <Section title="3. Customer Responsibility — Due Diligence">
            <p>
              By using BidRinse, Customers acknowledge that they are solely responsible for evaluating and selecting
              a Business before hiring. BidRinse provides tools to assist that evaluation — including verified reviews
              from completed jobs, business profiles, and ratings — but these tools are provided for informational
              purposes only. Customers should:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>Read reviews and ratings carefully before accepting any quote</li>
              <li>Ask the Business directly about their experience, references, and methods</li>
              <li>Request and verify proof of insurance before allowing a Business onto your property</li>
              <li>Clarify the full scope of work, materials, and pricing before any work begins</li>
              <li>Inspect completed work promptly and raise concerns directly with the Business</li>
            </ul>
            <p>
              BidRinse does not independently verify the licensing, credentials, or quality of work of any Business.
              Insurance status displayed on BidRinse is based solely on a Business's own declaration at the time of
              registration. It is the Customer's responsibility to independently confirm that a Business carries
              adequate insurance coverage before hiring.
            </p>
          </Section>

          <Section title="4. Business Responsibility">
            <p>
              By registering on BidRinse, Businesses agree that:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>They are solely responsible for all work they perform and all agreements they enter into with Customers</li>
              <li>They will maintain valid general liability insurance at all times while active on the platform</li>
              <li>They will honor quoted prices and perform work as described</li>
              <li>They will conduct themselves professionally and treat all Customers with respect</li>
              <li>They will resolve any disputes directly with Customers in good faith</li>
            </ul>
            <p>
              BidRinse shall not be held liable for any loss of business, loss of revenue, or reputational harm a
              Business may claim arises from their use of the platform, including as a result of disputes with Customers,
              account suspension, or removal from the platform.
            </p>
          </Section>

          <Section title="5. Insurance — Self-Declared">
            <p>
              BidRinse requires all Businesses to confirm they carry valid general liability insurance as a condition
              of registration. However, BidRinse does not independently verify, audit, or monitor Business insurance
              coverage. Insurance declarations are made solely by the Business and BidRinse makes no representation
              that any Business's insurance is current, adequate, or valid at the time a job is performed.
            </p>
            <p>
              Customers who require confirmation of insurance coverage must request proof directly from the Business
              before work begins.
            </p>
          </Section>

          <Section title="6. Reviews and Ratings">
            <p>
              Reviews on BidRinse are collected from Customers following completed jobs. While we take steps to ensure
              reviews reflect genuine completed transactions, BidRinse does not independently verify the accuracy of
              review content. Ratings are provided as a general guide only and should not be the sole basis for a
              hiring decision.
            </p>
          </Section>

          <Section title="7. Payments">
            <p>
              Payments are processed through Stripe, a third-party payment processor. BidRinse charges a commission
              fee on completed jobs (3.5% for residential, 5% for commercial). Stripe's terms and privacy policy
              apply to all payment processing. BidRinse is not a bank and does not hold customer funds.
            </p>
            <p>
              Payment disputes, chargebacks, or refund requests are subject to Stripe's policies. BidRinse's commission
              fee is non-refundable once a job is marked complete by both parties.
            </p>
          </Section>

          <Section title="8. Limitation of Liability">
            <p>
              To the maximum extent permitted by applicable law, BidRinse's total liability to any Customer or Business
              for any claim arising out of or related to use of the platform shall not exceed the total commission fees
              paid to BidRinse in connection with the specific job giving rise to the claim.
            </p>
            <p>
              BidRinse shall not be liable for any indirect, incidental, consequential, special, or punitive damages
              of any kind, including loss of profits, loss of data, or property damage, even if BidRinse has been
              advised of the possibility of such damages.
            </p>
          </Section>

          <Section title="9. Modifications">
            <p>
              BidRinse reserves the right to update these Terms at any time. Continued use of the platform after
              any update constitutes acceptance of the revised Terms. The date at the top of this page reflects the
              most recent revision.
            </p>
          </Section>

          <Section title="10. Contact">
            <p>
              Questions about these Terms can be directed to{' '}
              <a href="mailto:hello@bidrinse.com" className="text-sky-500 hover:text-sky-600 hover:underline">
                hello@bidrinse.com
              </a>.
            </p>
          </Section>

          <div className="border-t border-gray-100 pt-8 mt-4">
            <Link to="/" className="btn btn-outline btn-sm">← Back to Home</Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
