//Import for code parts of react and gatsby
import React from "react" //react core
//import Img from "gatsby-image" //gatsbys image API

//Link import to check if internal or external link
//import Link from "../utils/links" //custom links

const ContactForm = () => {
  return (
    <form name="contact" method="POST" data-netlify="true">

      <label>Name</label>
      <input type="text" id="fname" name="firstname" placeholder="Your name.." />

      <label>Message</label>
      <textarea id="subject" name="subject" placeholder="Write something.."></textarea>

      <button>Submit</button>

    </form>
  )

}

export default ContactForm
