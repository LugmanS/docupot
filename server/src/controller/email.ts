import { Resend } from "resend";


export const sendEmail = async (userEmail, type, document) => {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const documentLink = `${process.env.CLIENT_HOST}/document/${document._id}`;

    resend.emails.send({
        from: process.env.FROM_EMAIL,
        to: type === 'invited' ? userEmail : document.authorId,
        subject: type === 'invited' ? `Shared ${document.title} with you` : `Access request for ${document.title}`,
        html: type === 'invited' ? `<p>Hi there, <br>You have been shared ${document.title} file by ${document.authorId}. Check out the document by visiting this link <a href="${documentLink}">${documentLink}</a> </p>` : `<p>Hi there, <br>${userEmail} has requested access to the file ${document.authorId}. Manage permissions by visiting this link <a href="${documentLink}">${documentLink}</a></p>`
    }).catch(error => console.log(error));
};