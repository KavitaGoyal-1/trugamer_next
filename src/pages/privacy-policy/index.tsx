import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { storeOutsideToggle } from "@/store/slices/auth-slice";
import { getToken } from "@/utills/cookies";
import NewVerticalNavigation from "@/components/vertical-navigation/new-vertical-navigation";
import AuthenticatedNavigation from "@/components/layouts/authanticated-navigation";
import Footer from "@/components/layouts/footer";
import FooterDetailed from "@/components/layouts/footer-detailed";
import NavigationPublic from "@/components/layouts/navigation-public";

const PrivacyPolicy = () => {
  const isToggle = useSelector((state: any) => state?.authState?.headerToggle);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);
  const token = getToken();

  const dispatch = useDispatch();
  const navRef = useRef<HTMLDivElement | null>(null);

  // Close NewVerticalNavigation when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        // Close the sidebar if a click is outside
        if (isToggle) {
          dispatch(storeOutsideToggle(false));
          // Dispatch action to close sidebar (if managed via Redux)
          console.log("Clicked outside");
          // Alternatively, use local state to manage `isToggle` and update here
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isToggle]);

  return (
    <div className="relative">
      <section className="min-h-screen bg-cBlack-dark max-w-[2150px] mx-auto py-[80px] md:py-28 grid grid-cols-1  place-content-start  pl-[5%] md:pl-[6%]  pr-[5%] lg:pr-[5%]">
        <>
          <div
            className={
              isToggle ? "menucomon mobile-menus" : "menucomon mobile-right"
            }
            ref={navRef}
          >
            <NewVerticalNavigation token={token} />
          </div>
          <div className="max-lg:hidden">
            <AuthenticatedNavigation token={token} />
          </div>
          <div className="lg:hidden block">
            <NavigationPublic text={["Game Calendar"]} token={token} />
          </div>
        </>

        <div className="mt-5 md:mt-0 md:grid-cols-[1fr_max-content] items-center my-6 sm:ms-16">
          <div className="w-full">
            <h1 className="font-bold text-[32px] md:text-[44px] text-start">
              Privacy Policy
            </h1>
          </div>
          <p className="text-base md:text-lg my-4">
            This Privacy Policy (this “Policy”) applies to Trugamer Services,
            and any sites, mobile apps or products that display or link to this
            Policy. It does not apply to any website, mobile app, service, or
            product that does not display or link to this Policy or that
            contains its own privacy policy. When the Services receive or
            collect information, that information is being received and
            collected, and will be owned, by Trugamer.{" "}
          </p>
          <p className="text-base md:text-lg my-4">
            PLEASE READ THIS PRIVACY POLICY CAREFULLY TO UNDERSTAND HOW WE
            HANDLE YOUR INFORMATION. BY USING THE SERVICES, YOU ACKNOWLEDGE YOU
            HAVE READ AND UNDERSTAND THIS PRIVACY POLICY AND THAT WE WILL
            COLLECT, USE AND SHARE YOUR INFORMATION AS SET FORTH BELOW.
          </p>

          <h3 className="font-bold  text-[16px] md:text-xl text-white">
            1. PERSONAL INFORMATION WE COLLECT
          </h3>
          <p className="text-base md:text-lg mt-4 mb-2">
            The following personal information is collected by or on behalf of
            Trugamer:
          </p>
          <ul className="list-disc list-outside pl-5 mb-4">
            <li className="text-left mb-2 text-base md:text-lg">
              <span className="font-bold">Identifiers,</span> such as your name,
              alias, phone number, mailing and email addresses, IP address,
              account name or other similar identifiers, account credentials,
              address book entries, birth date, and ZIP code.
            </li>
            <li className="text-left mb-2 text-base md:text-lg">
              <span className="font-bold">
                Information you share during communications and interactions
                with us,
              </span>
               which may include the content of email messages, chat sessions,
              text messages, and phone calls.
            </li>
            <li className="text-left mb-2 text-base md:text-lg">
              <span className="font-bold">Demographic information,</span> which
              may include age or birth date, gender, ZIP code, your status as a
              user, and other information about you.
            </li>
            <li className="text-left mb-2 text-base md:text-lg">
              <span className="font-bold">User-generated content,</span>{" "}
              including, without limitation, photos, videos, audio, and other
              information you may submit to us, such as ratings/reviews or
              comments on our forums.
            </li>
            <li className="text-left mb-2 text-base md:text-lg">
              <span className="font-bold">Device-specific information,</span>{" "}
              including hardware model, operating system version, unique device
              identifiers, and mobile network information.
            </li>
          </ul>

          <h3 className="font-bold  text-[16px] md:text-xl text-white">
            2. HOW WE COLLECT YOUR PERSONAL INFORMATION
          </h3>
          <p className="text-base md:text-lg mt-4 mb-2">
            We collect personal information using both direct and indirect
            means. For example, when you email our customer care team, fill out
            a form on our Site, or otherwise provide information to Trugamer, we
            collect your information directly from you. We may also collect your
            personal information indirectly through automated means, for
            example, when you interact with our Site, we may use technologies to
            collect information about how you use the Site. We may also receive
            information about you from third parties including from our
            affiliates and subsidiaries, social media platforms or from our
            advertising partners.
          </p>
          <h4 className="text-base md:text-lg font-bold mb-1 mt-3">
            Personal Information Directly from You
          </h4>
          <p className="text-base md:text-lg mt-2 mb-2">
            We may collect personal information directly from you or your device
            as follows:
          </p>
          <ul className="list-disc list-outside pl-5 mb-4">
            <li className="text-left mb-2 text-base md:text-lg">
              <span className="font-bold">
                When you register for a Trugamer account,
              </span>{" "}
              it is necessary for you to provide personal information that
              includes your name and email address. You may choose to provide us
              with additional personal information, including billing, mailing,
              and shipping addresses, phone number, and a payment method (e.g.,
              credit card). If you make purchases through the Site, you will
              also create a username and password, information that on
              subsequent visits helps us confirm your identity and makes it
              easier for you to make purchases on our Site.
            </li>
            <li className="text-left mb-2 text-base md:text-lg">
              <span className="font-bold">
                When you interact with Trugamer,
              </span>{" "}
              including with a member of our team, contact our customer service
              team, respond to a survey, or engage in a promotional activity.
            </li>
            <li className="text-left mb-2 text-base md:text-lg">
              <span className="font-bold">
                When you sign up to receive emails,
              </span>{" "}
              including marketing communications.
            </li>
          </ul>
          <h4 className="text-base md:text-lg font-bold mb-1 mt-3">
            Personal Information from Third-Party Sources
          </h4>
          <p className="text-base md:text-lg mt-2 mb-2">
            To better understand your preferences, operate our business, and
            provide you with products and services, we may receive your personal
            information from the following third parties:
          </p>
          <ul className="list-disc list-outside pl-5 mb-4">
            <li className="text-left mb-2 text-base md:text-lg">
              <span className="font-bold">Online social networks</span> if you
              follow Trugamer on social media sites, e.g., Facebook, Instagram,
              Twitter, LinkedIn, TikTok. We may collect personal information
              when you communicate with us within the social media sites or use
              functionalities, plugins, widgets, or tools from social media
              platforms or networks in connection with our Site (e.g., to log
              into an account, or to share content with your friends and
              followers on social media) or when you click "Share This" or
              "Like" buttons. We think it is important to point out that if you
              make a post on a social media site, such as on Facebook or
              Instagram, or identify us in your social media feed by tagging us
              using a hashtag (#) or "at" (@), your personal information may be
              publicly available and is subject to the privacy policies of those
              social media sites. We recommend you review the privacy policies
              of any third-party sites you visit to understand the data
              collection and practices of those third parties.
            </li>
            <li className="text-left mb-2 text-base md:text-lg">
              <span className="font-bold">Third-party service providers</span>
               that support our business, including companies that help with our
              marketing efforts, analytics providers, advertising networks and
              cooperatives, third parties that share information with us about
              the different devices you use online, reviews you have posted on
              third-party sites about products we offer, and other third parties
              that we collaborate or work with. Personal Information using
              Automated Technologies Personal information is also collected
              through automated technologies and shared with us when you visit
              our Site, open an email, or click on one of our advertisements. 
            </li>
          </ul>

          <h4 className="text-base md:text-lg font-bold mb-1 mt-3">
            Personal Information using Automated Technologies
          </h4>
          <p className="text-base md:text-lg mt-2 mb-2">
            Personal information is also collected through automated
            technologies and shared with us when you visit our Site, open an
            email, or click on one of our advertisements. 
          </p>
          <p className="text-base md:text-lg mt-2 mb-2">
            We automatically create website and mobile application log files,
            which are created when you access our Site. In addition, automated
            data collection technologies—such as cookies, beacons, tags, and
            scripts—are used by us to analyze trends, administer the Site, and
            track users' movements around the Site. We, and our third-party
            service providers, also use these technologies to gather demographic
            information about our user base as individuals and in the aggregate.
          </p>
          <p className="text-base md:text-lg mt-2 mb-2">
            A "cookie" is a small text file that is stored on an individual's
            computer and downloaded to the computer or mobile device when they
            visit a website. Cookies then send information back to the
            originating website on each subsequent visit, or to another website
            that recognizes that same cookie. We use the following types of
            cookies:
          </p>
          <ul className="list-disc list-outside pl-5 mb-4">
            <li className="text-left mb-2 text-base md:text-lg">
              <span className="font-bold">Essential Cookies</span> are required
              to make our Site function properly and cannot be turned off in our
              systems. If you block these cookies, portions of our Site may not
              function properly.
            </li>
            <li className="text-left mb-2 text-base md:text-lg">
              <span className="font-bold">
                Performance and Functional Cookies
              </span>
               allow us to count visits and sources of traffic on our Site so we
              can measure and improve performance and functionality. By means of
              example, they help us know which features of the Site are used
              most and how visitors move around the Site.
            </li>
            <li className="text-left mb-2 text-base md:text-lg">
              <span className="font-bold">Targeted Advertising Cookies</span>
               may be used to analyze how you use this website, store your
              preferences, and provide the content and advertisements that are
              relevant to you.
            </li>
            <li className="text-left mb-2 text-base md:text-lg">
              <span className="font-bold">Social Media Cookies</span> allow you
              to share information using social media sharing buttons on social
              networks like Facebook, Instagram, LinkedIn, or Twitter. This
              information may then be used by the social media network to
              deliver targeted advertising to you.
            </li>
          </ul>
          <p className="text-base md:text-lg mt-2 mb-2">
            We may combine information collected automatically (as described
            above) from your interactions with our Services and your activity on
            third-party sites with other data (including personal information). 
          </p>
          <p className="text-base md:text-lg mt-2 mb-2">
            If you wish to opt out of allowing certain cookies, you may submit a
            request to{" "}
            <a href="mailto:support@trugamer.com" rel="nofollow">
              support@trugamer.com
            </a>
            . Please note that if you delete, block, or otherwise restrict
            cookies, or use a different computer or Internet browser, you will
            need to renew your cookie management choices.
          </p>
          <p className="text-base md:text-lg mt-2 mb-2">
            If you, or someone acting on your behalf, would like to request that
            we do not sell your personal information, you can send an email to
            <a href="mailto:support@trugamer.com" rel="nofollow">
              support@trugamer.com
            </a>
            .
          </p>
          <h3 className="font-bold  text-[16px] md:text-xl text-white mb-2">
            3. HOW WE USE YOUR PERSONAL INFORMATION
          </h3>
          <p className="text-base md:text-lg mt-4 mb-2">
            We may use your information for purposes including:
          </p>
          <ul className="list-disc list-outside pl-5 mb-4">
            <li className="text-left mb-2 text-base md:text-lg font-bold">
              Providing services and features
            </li>
            <li className="text-left mb-2 text-base md:text-lg font-bold">
              Customer support
            </li>
            <li className="text-left mb-2 text-base md:text-lg font-bold">
              Research and development
            </li>
            <li className="text-left mb-2 text-base md:text-lg font-bold">
              Communications from Trugamer
            </li>
            <li className="text-left mb-2 text-base md:text-lg font-bold">
              Legal requirements and other legal purposes
            </li>
          </ul>

          <h3 className="font-bold  text-[16px] md:text-xl text-white mb-2">
            4. WHEN WE SHARE YOUR PERSONAL INFORMATION
          </h3>
          <p className="text-base md:text-lg mt-4 mb-2">
            We may disclose your information to:
          </p>
          <ul className="list-disc list-outside pl-5 mb-4">
            <li className="text-left mb-2 text-base md:text-lg">
              <span className="font-bold">
                Advertisers, Advertising Networks, and Other Third Parties:
              </span>
               We may disclose information about how you use the Services and
              interact with content or ads to better tailor services, products,
              marketing and advertising on the Services and on third-party
              platforms. To enable these purposes, we may share certain
              demographics and interest information, user-generated content,
              device information and identifiers, connection and usage data,
              geolocation data, public and commercial information, and social
              media information. These third parties may use their own tracking
              technologies to collect or request information about you.
            </li>
            <li className="text-left mb-2 text-base md:text-lg">
              <span className="font-bold">Social Networks:</span> We may
              disclose your information to social media platforms for example,
              if you click on a Facebook “like” button on the Services, the
              “like” may appear on your Facebook account. To control this
              sharing of information, please review and adjust your privacy
              settings for the relevant social network. Depending on your
              privacy settings and actions on such network, we may disclose
              contact information, identification and demographic and interest
              information, user-generated content, device information and
              identifiers, connection and usage data, and social media
              information.
            </li>
            <li className="text-left mb-2 text-base md:text-lg">
              <span className="font-bold">Service Providers:</span> We engage
              vendors to perform services for business purposes on our behalf
              and provide information to them to enable them to provide us with
              such services, including research and analytics, hosting,
              transaction and payment processing, promotion administration,
              fraud prevention, identity management, acquisition and other
              services. Service providers may use such information for their
              operational purposes in order to provide their services to us.
            </li>
            <li className="text-left mb-2 text-base md:text-lg">
              <span className="font-bold">Search Engines:</span> You may be able
              to engage with other members of the Services or the public. This
              may make the name and photo associated with your profile and any
              comments or user-generated content you provide visible to other
              members of the Services or the general public. If the information
              is available to the general public, it may also be searchable by
              search engines.
            </li>
            <li className="text-left mb-2 text-base md:text-lg">
              <span className="font-bold">
                Law Enforcement, Regulators, Anti-fraud Coalitions and Other
                Groups:
              </span>{" "}
              We disclose any of the categories of information we collect, as
              appropriate, with these third parties in order to: protect and
              enforce the legal rights, privacy, and safety of ourselves and our
              visitors; protect against possible fraud or other illegal
              activity; respond to requests from government and other
              authorities; and otherwise comply with legal process.
            </li>
            <li className="text-left mb-2 text-base md:text-lg">
              <span className="font-bold">Other Sharing:</span> We may provide
              connection and usage information about you, often along with a
              hashed or masked identifier (contact information), with third
              parties such as partners and social networks to inform the
              advertising and other offers we send you and for advertising
              measurement or analytics.
            </li>
            <li className="text-left mb-2 text-base md:text-lg">
              <span className="font-bold">
                Sale or Transfer of All or Part of Our Business or Assets:
              </span>{" "}
              In the event that Trugamer is involved in a merger, acquisition,
              transfer of control, bankruptcy, reorganization or sale of assets,
              we may sell or transfer the information described in this Privacy
              Policy as part of that transaction or diligence associated with or
              in contemplation of such matters.
            </li>
          </ul>
          <h3 className="font-bold  text-[16px] md:text-xl text-white mb-2">
            5. INFORMATION RETENTION AND DELETION
          </h3>
          <p className="text-base md:text-lg mt-4 mb-4">
            We retain information for as long as you remain a Trugamer user,
            plus as long as is necessary to protect and preserve our legal
            interests. Users may request deletion of their accounts at any time.
          </p>
          <h3 className="font-bold  text-[16px] md:text-xl text-white mb-2">
            6. CHILDREN
          </h3>
          <p className="text-base md:text-lg mt-4 mb-4">
            Trugamer does not knowingly request or collect personal information
            from anyone younger than 18 years old without prior consent from a
            parent or legal guardian, and thus Trugamer requests that if you are
            under 18 we ask that you do not use the Services or provide us with
            any information. If we discover that we have inadvertently gathered
            any such information then we will, to the extent required by law,
            delete such information from our records. Please contact 
            <a href="mailto:support@trugamer.com" rel="nofollow">
              support@trugamer.com
            </a>{" "}
            if you believe your child under age 18 has submitted personal
            information to Trugamer without prior parental or legal guardian
            consent so that we can take steps to delete the information.
          </p>
          <h3 className="font-bold  text-[16px] md:text-xl text-white mb-2">
            7. YOUR RIGHTS
          </h3>
          <p className="text-base md:text-lg mt-4 mb-4">
            Depending on where you live, you may have certain rights with
            respect to your information. Upon submittal of a request and
            confirmation of your identity, we will respond in accordance with
            and within the time period prescribed by applicable law. We will
            take reasonable steps to confirm your identity. 
          </p>
          <p className="text-base md:text-lg mt-4 mb-2">
            Some types of requests you may submit are as follows:
          </p>
          <ul className="list-disc list-outside pl-5 mb-4">
            <li className="text-left mb-2 text-base md:text-lg">
              <span className="font-bold">
                Request Categories of Information:
              </span>{" "}
              If you, or someone acting on your behalf, would like to request
              that we tell you the categories of personal information we
              collect, the categories of sources from which personal information
              is collected, the business or commercial purpose for collecting or
              selling the personal information, the categories of third parties
              with which the business shares personal information, the
              categories of information about you that we sell, the categories
              of third parties to whom the personal information was sold, or the
              categories of personal information that were disclosed for a
              business purpose, you or someone acting on your behalf can send an
              email to{" "}
              <a href="mailto:support@trugamer.com" rel="nofollow">
                support@trugamer.com
              </a>
              .
            </li>
            <li className="text-left mb-2 text-base md:text-lg">
              <span className="font-bold">Request Specific Information:</span>{" "}
              If you, or someone acting on your behalf, would like to request
              that we tell you about some of the specific personal information
              that we hold about you, you or someone acting on your behalf can
              send an email to
              <a href="mailto:support@trugamer.com" rel="nofollow">
                support@trugamer.com
              </a>
              .
            </li>
            <li className="text-left mb-2 text-base md:text-lg">
              <span className="font-bold">Request Correction:</span> If you
              would like to request that we correct certain personal information
              that we hold about you, you can send an email to{" "}
              <a href="mailto:support@trugamer.com" rel="nofollow">
                support@trugamer.com
              </a>
              .
            </li>
            <li className="text-left mb-2 text-base md:text-lg">
              <span className="font-bold">Request Deletion:</span> If you, or
              someone acting on your behalf, would like to request that we
              delete information that we hold about you, you or someone acting
              on your behalf can send an email to
              <a href="mailto:support@trugamer.com" rel="nofollow">
                support@trugamer.com
              </a>
              . Please note that certain information about you may not be
              deleted if you request such a deletion, as permitted by law. Also
              note that we will not be able to provide you with certain Services
              upon a deletion. You will also need to clear your cookies and
              re-set your cookie preferences.
            </li>
          </ul>
          <h3 className="font-bold  text-[16px] md:text-xl text-white  mb-2">
            8. POLICY UPDATES
          </h3>
          <p className="text-base md:text-lg mt-4 mb-2">
            Trugamer may make changes to this Policy from time to time and may
            apply any changes to information previously collected, as permitted
            by law. Please be sure to check this Policy for updates.
          </p>
          <p className="text-base md:text-lg mt-4 mb-4">
            The date of this Privacy Policy indicates the most recent updated
            version. If Trugamer makes material changes to this Policy, we will
            notify you, such as by posting the updated Policy on the Websites or
            Apps, and/or as otherwise required by applicable law.
          </p>
          <h3 className="font-bold  text-[16px] md:text-xl text-white mb-2">
            9. INTERNATIONAL USE
          </h3>
          <p className="text-base md:text-lg mt-4 mb-4">
            Please be advised that Trugamer is headquartered in the United
            States and may transfer your information to those parties described
            in this Privacy Policy outside of your country of residence,
            including in the United States and other countries. This is
            necessary to provide the Services and for the purposes outlined in
            this Privacy Policy. Data privacy laws vary from country to country,
            and they may not be equivalent to, or as protective as, the laws in
            your home country. Trugamer, to the best of its ability, will take
            steps to ensure that reasonable safeguards are in place with an aim
            to ensure an appropriate level of protection for your information,
            in accordance with applicable law. By providing us with your
            information, you acknowledge any such transfer, storage or use.
          </p>
          <h3 className="font-bold  text-[16px] md:text-xl text-white mb-2">
            10. CONTACT US
          </h3>
          <p className="text-base md:text-lg mt-4 mb-2">
            If you have questions about this Policy or our privacy practices,
            please contact us at{" "}
            <a href="mailto:support@trugamer.com" rel="nofollow">
              support@trugamer.com
            </a>
            .
          </p>
        </div>
      </section>
      <div className="max-md:hidden">
        <Footer />
      </div>
      <div className="md:hidden block">
        <FooterDetailed />
      </div>
    </div>
  );
};

export default PrivacyPolicy;
