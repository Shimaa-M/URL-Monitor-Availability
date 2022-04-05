import mailgun from 'mailgun-js';
const DOMAIN = "sandbox50a1e4226dda42a89b3549821afab270.mailgun.org";
const mg = mailgun({ apiKey: "513482ffe62ce4c448289376f05ed9da-62916a6c-5b7730e1", domain: DOMAIN });

export const sendEmail = (urlTOCheck,error,email) => {
const data = {
    from: "Mailgun Sandbox <postmaster@sandbox50a1e4226dda42a89b3549821afab270.mailgun.org>",
    to: `${email}`,
    subject: `${urlTOCheck} is down!`,
    text: `Please check what's wrong with your server ${error} \n`
  };
  mg.messages().send(data, function (error, body) {
    console.log(body);
  });
};