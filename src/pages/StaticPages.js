import React from 'react';
import './StaticPages.css';

const PageWrapper = ({ title, children }) => (
  <div className="static-page-container">
    <h1 className="static-page-title">{title}</h1>
    <div className="static-page-content">{children}</div>
  </div>
);

export const ContactPage = () => (
  <PageWrapper title="Contact Us">
    <p>
      If you have any questions, please feel free to reach out to us at{' '}
      <a href="mailto:support@delan.in">support@delan.in</a> or call us at{' '}
      <a href="tel:+919310329849">+91 93103 29849</a>. We'll get back to you as soon as
      possible!
    </p>
  </PageWrapper>
);

export const PrivacyPolicyPage = () => (
  <PageWrapper title="Privacy Policy">
    <p><strong>Last Updated: 5 September 2025</strong></p>
    <p>
      Welcome to Delan ("we," "us," "our"). We are committed to protecting your privacy and
      ensuring the security of your personal information. This Privacy Policy outlines how we
      collect, use, disclose, and safeguard your data when you visit our website and purchase
      our products.
    </p>

    <h2>1. Information We Collect</h2>
    <ul>
      <li>
        <strong>Personally Identifiable Information (PII):</strong> Full name, email address,
        mobile number, shipping and billing addresses.
      </li>
      <li>
        <strong>Non-Personal Information:</strong> IP address, browser type & version, device
        details, and browsing activity.
      </li>
      <li>
        <strong>Payment Information:</strong> Processed securely via third-party gateways.
        We do not store sensitive payment details.
      </li>
    </ul>

    <h2>2. How We Use Your Information</h2>
    <ul>
      <li>To process and fulfill your orders</li>
      <li>To communicate with you regarding orders or support</li>
      <li>For marketing and promotional updates (optional opt-in)</li>
      <li>To improve our website and customer experience</li>
      <li>For fraud prevention, security, and compliance with law</li>
    </ul>

    <h2>3. Cookies & Tracking</h2>
    <p>
      We use cookies and similar technologies to improve your browsing experience and remember
      your preferences. You can disable cookies in your browser settings.
    </p>

    <h2>4. Data Sharing</h2>
    <p>
      We do not sell your personal data. We may share information with trusted providers like
      courier partners, payment gateways, and marketing services, only as necessary.
    </p>

    <h2>5. Security</h2>
    <p>
      We implement SSL encryption and industry-standard measures to protect your personal data
      from unauthorized access.
    </p>

    <h2>6. Your Rights</h2>
    <p>
      You can access, update, or correct your data anytime. You may unsubscribe from marketing
      emails at any point.
    </p>

    <h2>7. Changes</h2>
    <p>
      We may update this Privacy Policy occasionally. Updates will be reflected here with the
      revised "Last Updated" date.
    </p>

    <h2>8. Contact / Grievance Officer</h2>
    <p>
      Email: <a href="mailto:privacy@delan.in">privacy@delan.in</a> <br />
      Phone: <a href="tel:+919310329849">+91 93103 29849</a>
    </p>
  </PageWrapper>
);

export const TermsPage = () => (
  <PageWrapper title="Terms & Conditions">
    <p><strong>Last Updated: 5 September 2025</strong></p>

    <h2>1. Eligibility</h2>
    <p>You must be at least 18 years old or supervised by a guardian to use this website.</p>

    <h2>2. Products & Pricing</h2>
    <p>
      Prices are displayed in INR and inclusive of GST unless otherwise stated. Product details
      may change without prior notice.
    </p>

    <h2>3. Orders & Payments</h2>
    <p>
      Orders may be refused or cancelled due to errors, unavailability, or suspected fraud. We
      accept secure payments via third-party gateways.
    </p>

    <h2>4. Shipping & Delivery</h2>
    <p>
      Please refer to our Shipping Policy for timelines and costs. We are not liable for courier
      delays beyond our control.
    </p>

    <h2>5. Returns & Exchanges</h2>
    <p>
      Returns and exchanges are subject to our official policy. By purchasing, you accept these
      conditions.
    </p>

    <h2>6. Intellectual Property</h2>
    <p>
      All website content is owned by Delan and protected under copyright/trademark law. Any
      unauthorized use is prohibited.
    </p>

    <h2>7. User Conduct</h2>
    <p>
      You must not use this site unlawfully or post offensive, defamatory, or harmful content.
    </p>

    <h2>8. Limitation of Liability</h2>
    <p>
      Delan is not liable for indirect, incidental, or consequential damages. Liability is
      limited to the value of your purchase.
    </p>

    <h2>9. Governing Law</h2>
    <p>These Terms are governed by the laws of India, jurisdiction in New Delhi, Delhi.</p>

    <h2>10. Contact</h2>
    <p>Email: <a href="mailto:support@delan.in">support@delan.in</a></p>
  </PageWrapper>
);

export const ReturnsPage = () => (
  <PageWrapper title="Returns & Exchanges">
    <p>
      At Delan, your satisfaction is important. Please read our 3-day return and 6-day exchange
      policy below.
    </p>

    <h2>3-Day Return (Refund)</h2>
    <ul>
      <li>Seal must be intact and unbroken</li>
      <li>Item unused, unwashed, with all tags</li>
      <li>Request must be made within 3 days of delivery</li>
    </ul>

    <h2>6-Day Exchange</h2>
    <ul>
      <li>Valid for size or color changes</li>
      <li>Items with broken seal are exchange-eligible but non-refundable</li>
      <li>One-time exchange only</li>
    </ul>

    <h2>Process</h2>
    <ol>
      <li>Email support@delan.in within the timeframe with order ID</li>
      <li>We will schedule a reverse pickup</li>
      <li>Refunds processed in 5–7 days after quality check</li>
      <li>Exchanges shipped within 2–3 business days subject to stock</li>
    </ol>

    <h2>Damaged/Incorrect Items</h2>
    <p>
      If your order is damaged or incorrect, contact us within 48 hours with a photo. You are
      eligible for replacement or full refund regardless of seal.
    </p>

    <h2>Contact Us</h2>
    <p>
      Email: <a href="mailto:support@delan.in">support@delan.in</a> <br />
      Phone: <a href="tel:+919310329849">+91 93103 29849</a>
    </p>

  </PageWrapper>
);

export const AboutUsPage = () => (
  <PageWrapper title="Our Story: 25 Years of Style">
    <p>
      For a quarter of a century, Delan has celebrated timeless elegance in women’s fashion. We
      believe fashion is self-expression, and our premium western wear is designed for the modern
      woman who values confidence, individuality, and grace.
    </p>

    <h2>Our Promise</h2>
    <ul>
      <li>
        <strong>Fit:</strong> Perfected tailoring for flattering, comfortable silhouettes.
      </li>
      <li>
        <strong>Fabric:</strong> Luxurious materials sourced from trusted suppliers.
      </li>
      <li>
        <strong>Femininity:</strong> Modern, refined designs that never go out of style.
      </li>
    </ul>

    <h2>The Delan Woman</h2>
    <p>
      She is ambitious, stylish, and authentic. For 25 years, we’ve dressed women through their
      career milestones and life’s celebrations. She doesn’t follow fleeting trends — she builds
      a legacy of elegance.
    </p>

    <h2>Looking Ahead</h2>
    <p>
      Our promise remains the same: to create more than clothing. We craft companions for your
      moments — pieces that elevate confidence and embody sophistication you can always rely on.
    </p>

    <p>
      Welcome to <strong>Delan</strong>. 25 years of elegance, and we’re just getting started.
    </p>
    <img src='/images/story-background.png' alt='story-image' className='story-image'/>
    <h2>The Delan Essence</h2>
    <p>From timeless co-ord sets to empowering silhouettes, we’ve reimagined what modern fashion means for women.
Across India, women aren’t just wearing Delan—they’re expressing confidence, embracing individuality, and shaping
their own stories with every outfit.</p>
  </PageWrapper>
);
