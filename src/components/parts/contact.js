//Import for code parts of react and gatsby
import React from "react" //react core
//import Img from "gatsby-image" //gatsbys image API

//Link import to check if internal or external link
//import Link from "../utils/links" //custom links

const ContactForm = () => {
  return (
<form name="contact" method="post" data-netlify="true" data-netlify-honeypot="bot-field">
      <input type="hidden" name="bot-field" />
      <input type="hidden" name="form-name" value="contact" />

      <label>Name</label>
      <input type="text" name="name" placeholder="Your name.." />

      <label>Email</label>
      <input type="email" name="email" placeholder="Your email.." />

      <label>Message</label>
      <textarea name="message" placeholder="Write something.."></textarea>

      <button type="submit">Submit</button>

    </form>
  )

}

export default ContactForm
