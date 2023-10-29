import React, { useState } from "react";
import { BugzyComponent } from "./BugzyComponent";

export default {
  title: "TestComponent",
};

const PROJECT_ID = "63abfccb-6685-47d7-bfe0-53aed2f8e064";

export const WithText = () => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open</button>
      <BugzyComponent
        projectID={PROJECT_ID}
        isOpen={isOpen}
        setOpen={setIsOpen}
        userEmail="sarvetanvesh01@gmail.com"
      />
      <HTMLComponent />
    </>
  );
};

const HTMLComponent = () => (
  <>
    <header>
      <nav>
        <div className="container">
          <h1>Your SaaS Product</h1>
          <ul>
            <li>
              <a href="#features">Features</a>
            </li>
            <li>
              <a href="#pricing">Pricing</a>
            </li>
            <li>
              <a href="#testimonials">Testimonials</a>
            </li>
            <li>
              <a href="#contact">Contact</a>
            </li>
          </ul>
        </div>
      </nav>
      <div className="hero">
        <div className="container">
          <h2>Welcome to Your SaaS Product</h2>
          <p>A brief description of your product and its benefits.</p>
          <a href="#signup" className="cta-button">
            Get Started
          </a>
        </div>
      </div>
    </header>

    <section id="features" className="features">
      <div className="container">
        <h2>Key Features</h2>
        <div className="feature">
          <h3>Feature 1</h3>
          <p>Description of the first feature.</p>
        </div>
        <div className="feature">
          <h3>Feature 2</h3>
          <p>Description of the second feature.</p>
        </div>
        <div className="feature">
          <h3>Feature 3</h3>
          <p>Description of the third feature.</p>
        </div>
      </div>
    </section>

    <section id="pricing" className="pricing">
      <div className="container">
        <h2>Pricing</h2>
        <div className="pricing-plan">
          <h3>Basic Plan</h3>
          <p>$10/month</p>
          <ul>
            <li>Feature 1</li>
            <li>Feature 2</li>
            <li>Feature 3</li>
          </ul>
          <a href="#signup" className="cta-button">
            Get Started
          </a>
        </div>
        <div className="pricing-plan">
          <h3>Premium Plan</h3>
          <p>$20/month</p>
          <ul>
            <li>Feature 1</li>
            <li>Feature 2</li>
            <li>Feature 3</li>
            <li>Priority Support</li>
          </ul>
          <a href="#signup" className="cta-button">
            Get Started
          </a>
        </div>
      </div>
    </section>

    <section id="testimonials" className="testimonials">
      <div className="container">
        <h2>Testimonials</h2>
        <div className="testimonial">
          <blockquote>
            "I love Your SaaS Product! It has made my life so much easier."
          </blockquote>
          <p>- Happy Customer 1</p>
        </div>
        <div className="testimonial">
          <blockquote>
            "I can't imagine running my business without Your SaaS Product."
          </blockquote>
          <p>- Happy Customer 2</p>
        </div>
      </div>
    </section>

    <section id="contact" className="contact">
      <div className="container">
        <h2>Contact Us</h2>
        <p>
          If you have any questions or need assistance, feel free to get in
          touch with us.
        </p>
        <a href="mailto:contact@example.com" className="cta-button">
          Email Us
        </a>
      </div>
    </section>

    <footer>
      <div className="container">
        <p>&copy; 2023 Your SaaS Product. All rights reserved.</p>
      </div>
    </footer>
  </>
);
