import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { IAttributes } from "../../types/contact";
import { getApi, getApiKey } from "@/utills/get-api";
import { Aside } from "@/components/contact/aside/aside";
import { catchError } from "@/utills/catch-error";
import ContactForm from "@/components/contact/contact-form";

const Contact = () => {
  const [contactInfo, setContactInfo] = useState<IAttributes | null>(null);
  //   useEffect(() => {
  //     const getContactInfo = async () => {
  //       try {
  //         //I should create a handler for this query parameters
  //         let req = await axios.get(
  //           `${getApi()}/contact-page?populate=contactMeans.icon&populate=social_icons.icon`,
  //           {
  //             headers: { Authorization: `Bearer ${getApiKey()}` },
  //           }
  //         );
  //         let contactPageInfo = req.data.data.attributes;
  //         setContactInfo(contactPageInfo);
  //       } catch (error: AxiosError | Error | unknown) {
  //         catchError(error);
  //       }
  //     };
  //     getContactInfo();
  //   }, []);
  return (
    <section className="min-h-screen grid grid-cols-[30%_1fr]">
      <Aside contactInfo={contactInfo} />

      <div className="bg-cBlack-dark grid place-content-center">
        <div className="max-w-[90%] md:max-w-[480px] mx-auto grid gap-6 grid-cols-1 py-20">
          <div className="w-full">
            <h1 className="text-white text-[36px] text-start font-semibold">
              {contactInfo?.formTitle}
            </h1>
            <p className="text-cPurple-light text-base text-start font-regular text-cGray-500">
              {contactInfo?.formMessage}{" "}
              <span className="text-cBlue-light cursor-pointer">
                {contactInfo?.formEmail}
              </span>
            </p>
          </div>

          <ContactForm />
        </div>
      </div>
    </section>
  );
};

export default Contact;
