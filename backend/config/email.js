import sgMail from "@sendgrid/mail";

const sendgrid_key = process.env.SENDGRID;
sgMail.setApiKey(sendgrid_key);

export const sendgridMail = async (emails, template_id, dynamic_template_data) => {
    const msg = {
        to: emails,
        from: "info@example.com",
        templateId: template_id,
        dynamic_template_data: dynamic_template_data,
    };
    sgMail.send(msg, err => {
        if (err) {
            console.log({
                error: true,
                message: "email didn't send, please try again",
                data: err,
            });
        }
    });
};

//postmark mail here

const Emails = {
    sendgridMail,
};

export default Emails;
