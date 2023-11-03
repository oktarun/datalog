// tools like messaging to me when err hapenned and sending all data to one mail each day
// import nodeMailer from "nodemailer";




const nodemailer = require('nodemailer');
// const { google } = require('googleapis');

// const { JWT } = require('google-auth-library');

// const fs = require('fs');

// const OAuth2 = google.auth.OAuth2;


// const serviceAccountKey = require('../flowing-vision-400922-13c6a6d70d1e.json');


















// const client = new JWT({
//     email: 'tradersco@flowing-vision-400922.iam.gserviceaccount.com',
//     key: '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDp6Gg01yPlqiQ4\nm4mxOT8XCku+UqFeob5hN14fEkP2ZB7oxexM6GfdbOCxGSYx4tszrF7722Q9FjpE\nxg2KTuYLOVkxB4DG1UZ0B7a98Ac50xsuxU8ZBZuqcHINipryGeGQYTmhyzmOm0mG\nDdHzisiYRO02Qzj6udnJXYeuFchGnASm9nmxgyxGwsst594uvvfTNqewJNy7wwVj\nQ+Lq7YZisTmpbZvDC/Zd3L457L/dy8B2voYLD9TQqGwaI3YXWI9FgjKxxQVcNw2T\naO0YWY+xni1xedsH/ZQ9vfFXxtPZmITKwlK+3tigMW6HbCcXthpA8OxlaqCoq9D7\nMQbATI25AgMBAAECggEACnfZOgwq0ht0NYhYeDL8rNZMH39pM2f/sjAdKTzTB9Lh\nQz+gXKzGATXfNG3QtMjXUI+1TIY8DTPSdcN7VaZES1pMsJIKZFulJIo31nZIjIDz\nJXu1F4SVu+H+aLa8Snt4CdMgFiqXL9epSbOSotiiM5ZaG2SUxzvMEGP8L4FQDkDV\nV3p6KD5JIkg3VbwSAq+YW6KEMjY78Vnp0AWHEu/uZNkBsNgysgUAQSy0Gm1jT8+z\nhd3QupvgffMWDajsJ3ztZT5WsZodxGeDT9M17rL5GpOFc1CHBc2Amxlt3hYl+KLW\nrXU9st5OtuXzHCplpEiSW0ioAh4Al750vdA7jnXuBQKBgQD7AAcY3D0x6OX4QQUl\n7BYD2KFWE3DqjdF5FR3zVQZyMwV2hLu0DmhWl5hybyZCN+5fttOEqBesHvFrsjRu\nhKhacr/fwsJwdUUmCusgT1IpSlHmu1UN5jzNbp+uJ4N4DMighvoftntR8iVGJ0tP\nHXS2KembPp7JpjzDYIN68xzuPwKBgQDukTeuGkZ4AQzzOWWqfbKM4MIyY37HAsBO\nbXP1Tj4+zKhPrm/I9pBl5AioYzcbswsVuW329oLt99byYCrr9LMYymc004hajUf9\naV+ItnIp9LqDCcMwmvFbfHVfmQA7sufd9FynSKDVvXBFKzDVTLgKHTl6oW1s5V1K\n2mWBcQ92BwKBgCRhVaYBzhDc2/BGpFNhy7MVBBVwze4BTjpJmES7ryqAQKt0A6zO\nZcsfP+ZeO+JfLvrKig/xOTUmawGcG8NlEO3DMhJhrUMVjEc+T+Qn+xWnAwX5YxOX\nqnpwLU7VxVVyLOYvijNshKVU/pgTe/PkphT9MDHjOqqpoKcE5ym78RaLAoGALpZR\nJ0CeTkT2QHEO93JAcd5aTfi8AyT4ZNhe8qJq6VyR6a2IytfLbvpO7oMhedlG6uEh\nJj8RZmMlqIM7HoTUjJzJ9rjwQa6hRk1TiKEIPkU6PuijI1S+mTz+tsJsFzxipydX\nCJvYPKUXzYoXqS+oKOF4Hgh0E/XeeAWaGOL5P/UCgYB0L2+xtWNz8hRoXeTmfCIg\nhKaotHA52DIjt0z3oEVDVmt6dpHd9zKDFgBMtH1BfEPAznDduczMpCNpR2LjNUx3\nx7M3b8fxCL9R/qNecZ6Nn5k66NOuUA+PS0zdmay0UV6bZ7HRM2bHqQPVfbb4q2E8\nuchRhfqV57NnhKAStQGyGw==\n-----END PRIVATE KEY-----\n',
//     scopes: ['https://www.googleapis.com/auth/gmail.compose'], // Specify the required scope(s)
// });



// const gmail = google.gmail({
//     version: 'v1',
//     auth: client,
// });




// // Define the email content
// const emailContent = {
//     to: 'shubhconstellation@gmail.com',
//     subject: 'Hello, Gmail API',
//     message: 'This is a test email sent using the Gmail API with a service account.',
// };


// // Create a message with the email content
// const email = [
//     'Content-Type: text/plain; charset="UTF-8"\r\n',
//     'MIME-Version: 1.0\r\n',
//     `To: ${emailContent.to}\r\n`,
//     `Subject: ${emailContent.subject}\r\n`,
//     '\r\n',
//     emailContent.message,
// ].join('');

// // Encode the email message to base64
// const base64EncodedEmail = Buffer.from(email).toString('base64');



// function errHandler(err) {


//     var mailOptions = {
//         from: 'Traders Co.',
//         to: 'ytarun483@gmail.com',
//         subject: 'Sending Email using Node.js',
//         text: 'That was easy!'
//     };

//     transporter.sendMail(mailOptions, function (error, info) {
//         if (error) {
//             console.log(error);
//         } else {
//             console.log('Email sent: ' + info.response);
//         }
//     });

// };



function readyBackupAndSendOne(req, res, next) {
  const mailTransporter = nodemailer.createTransport({

    // service : "gmail",
    // auth:{
    //   user:"shubhconstellation@gmail.com",
    //   pass: "kaahobhaiya!@#"
    // }
  
  
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'paxton.walter29@ethereal.email',
      pass: 'qktGBky9Dv9mQR68AA'
    }
  });
  
  let details = {
    from: "Vin Diesel <deshdesh@khatiyamail.com>",
    to: "shubhconstellation@gmail.com",
    subject: "testing or nodemailer",
    text: "testing or first sender",
    html: "<b>Hello bro</b>"
  }
  
  mailTransporter.sendMail(details, (err, response) => {
    if (err) {
      console.log("some error happened", err);
      res.json(err)
      
      
      
    } else {
      console.log("email has sent", response)
      res.json(response)
  
    }
  });


  //     // Create an OAuth2 client for the service account
  // const auth = new google.auth.GoogleAuth({
  //     credentials: {
  //       client_email: serviceAccountKey.client_email,
  //       private_key: serviceAccountKey.private_key,
  //     },
  //     scopes: ['https://www.googleapis.com/auth/gmail.send'],
  //   });

  //   // Create a Gmail API client
  //   const gmail = google.gmail({ version: 'v1', auth });

  //   // Create a transporter for sending emails using Nodemailer
  //   const transporter = nodemailer.createTransport({
  //     service: 'Gmail',
  //     auth: {
  //       type: 'OAuth2',
  //       user: serviceAccountKey.client_email,
  //       clientId: serviceAccountKey.client_id,
  //       clientSecret: serviceAccountKey.private_key,
  //     },
  //   });

  //   // Define the email content
  //   const mailOptions = {
  //     from: serviceAccountKey.client_email,
  //     to: 'shubhconstellation@gmail.com>>>>>',
  //     subject: 'Subject',
  //     text: 'Message text',
  //   };

  //   // Send the email
  //   transporter.sendMail(mailOptions, (sendMailErr, info) => {
  //     if (sendMailErr) {
  //       console.error('Error sending email:', sendMailErr);
  //     } else {
  //       console.log('Email sent:', info.response);
  //     }
  //   });

  // // Create an OAuth2 client for the service account
  // const auth = new google.auth.OAuth2({
  //     clientId: serviceAccountKey.client_id,
  //     clientSecret: serviceAccountKey.private_key,
  //     redirectUri: 'urn:ietf:wg:oauth:2.0:oob',
  //   });

  //   // Generate an authorization URL for your service account
  //   const authorizeUrl = auth.generateAuthUrl({
  //     access_type: 'offline',
  //     scope: 'https://www.googleapis.com/auth/gmail.send',
  //   });

  //   console.log('Authorize this app by visiting this url:', authorizeUrl);


  // // Send the email
  // gmail.users.messages.send(
  //     {
  //         userId: 'me', // 'me' represents the authenticated user's email
  //         requestBody: {
  //             raw: base64EncodedEmail,
  //         },
  //     },
  //     (error, response) => {
  //         if (error) {
  //             console.error('Error sending email:', error);
  //             if (error.response && error.response.data) {
  //               console.error('Response data:', error.response.data);
  //             }
  //           } else {
  //             console.log('Email sent:', response.data);
  //         }
  //     }
  // );

};








module.exports = { readyBackupAndSendOne };