import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { storeOutsideToggle } from "@/store/slices/auth-slice";
import { getToken } from "@/utills/cookies";
import NewVerticalNavigation from "@/components/vertical-navigation/new-vertical-navigation";
import AuthenticatedNavigation from "@/components/layouts/authanticated-navigation";
import NavigationPublic from "@/components/layouts/navigation-public";
import Footer from "@/components/layouts/footer";
import FooterDetailed from "@/components/layouts/footer-detailed";

const TermCondition = () => {
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

        <div className="mt-5 md:mt-0 mb-6 md:ms-16">
          <div className="w-full">
            <h1 className="font-bold text-[32px] md:text-[44px] text-start">
              Term Condition
            </h1>
          </div>
          <h3 className="font-bold mt-4 text-[16px] md:text-[16px] md:text-xl text-white">
            1. ACCEPTANCE OF TERMS
          </h3>
          <p className=" text-base md:text-lg mt-4 mb-2">
            These Terms of Use (“Terms”) set forth the terms and conditions that
            apply to your use of the Trugamer website (the “Site”) and any and
            all affiliated websites (collectively, “Services”). By using the
            Services, you agree that you have read, understand and agree to be
            legally bound by these Terms.
          </p>
          <ul className="list-disc list-outside pl-5 mb-4">
            <li className="text-left mb-2 text-base md:text-lg">
              <p className="mb-2">
                By using or accessing the Services, you agree to these Terms,
                whether you are a registered user or not. If you do not agree to
                these Terms, please do not use the Services. These Terms shall
                remain in full force and effect so long as you are a user of the
                Services, and you may still be bound by certain obligations even
                after your use of the Services terminates. The Services and the
                Site are not designed or intended for use by people who are
                under 18, and thus all users must be at least 18 years of age. 
              </p>
              <p className="mb-2">
                Trugamer, in its sole discretion, may change these Terms from
                time to time on a prospective basis, and modify, add or
                discontinue any aspect, content or feature of the Services. Your
                continued use or accessing of the Services following the posting
                of any changes to the Terms constitutes your acceptance of such
                changes. To the extent that an arbitrator or court of applicable
                jurisdiction determines that applying any changes to these Terms
                would render this an illusory or unenforceable contract, such
                changes shall be applicable on a prospective basis only, with
                respect to events or circumstances occurring after the date of
                such changes, to the extent necessary to avoid these Terms being
                deemed illusory or unenforceable.
              </p>
            </li>
          </ul>
          <h3 className="font-bold mt-4 text-[16px] md:text-xl text-white  mb-4">
            2. PERMITTED USE
          </h3>
          <ul className="list-disc list-outside pl-5 mb-4">
            <li className="text-left mb-2 text-base md:text-lg">
              The Site and Services are for your personal and non-commercial
              use. They contain material that is derived in whole or in part
              from material supplied and owned by other sources. Such material
              is protected by copyright, trademark and other applicable laws.
              Unless otherwise agreed to in writing by Trugamer, you agree that
              you will not use the Services, or duplicate, download, publish,
              modify or otherwise distribute or use any material in the Services
              for any purpose, except for your personal, non-commercial use. You
              also agree that you will not link to any page on the Site other
              than the home page (for example, "deep linking"), without
              Trugamer’s prior written consent. Use of the Services or any
              materials or content on the Services for any commercial or other
              unauthorized purpose is prohibited. You acknowledge that storing,
              distributing or transmitting unlawful material could expose you to
              criminal and/or civil liability. You may not download or modify
              the Services or any portion of them unless we have provided you
              with express written consent. You shall not make a derivative use
              of the Services (or any part thereof) for any purpose, nor shall
              you download or copy information of users, or otherwise engage in
              data mining or similar data gathering.
            </li>
          </ul>
          <h3 className="font-bold mt-4 text-[16px] md:text-xl text-white mb-4">
            3. REGISTRATION, ACCOUNTS AND PASSWORDS
          </h3>
          <ul className="list-disc list-outside pl-5 mb-4">
            <li className="text-left mb-2 text-base md:text-lg">
              If you register an account on the Site, you agree to provide true
              and accurate data about yourself on our account registration form,
              and to update and keep such data current. You are solely
              responsible for maintaining the confidentiality of your username,
              password and other account information, and you are solely
              responsible for all use of your username, password or other
              account information, whether authorized by you or not. You shall
              not allow other persons access to or use of such username or
              password. You shall not post your username or password on any
              website nor transmit it through unsecured sites. You agree to (a)
              immediately notify Trugamer of any unauthorized use of your
              password or account or any other breach of security and (b) ensure
              that you exit from your account each time you use the Services.
              Trugamer may terminate your membership and access to the Services
              if we learn that you have provided false or misleading
              registration data. If Trugamer, in our sole and absolute
              discretion, determines that your username and password are
              insecure or otherwise problematic, we may require you to change it
              or terminate your account.
            </li>
          </ul>
          <p className="text-base md:text-lg mt-4 mb-2">
            We may use the email address you provide to us to send you Site and
            Services messages and updates. By becoming a user of the Site, you
            are consenting to the receipt of these communications.
          </p>
          <p className="text-base md:text-lg mt-4 mb-2">
            Trugamer may terminate your account for certain reasons, including
            violation of the letter or spirit of these Terms, or any behavior
            that is harmful to other users, third parties, or the business
            interests of Trugamer, as determined in our sole and absolute
            discretion. You may not create another account if we suspend or
            terminate your account for any reason, without our express written
            permission.
          </p>
          <h3 className="font-bold mt-4 text-[16px] md:text-xl text-white mb-4">
            4. USER CONTENT
          </h3>
          <ul className="list-disc list-outside pl-5 mb-4">
            <li className="text-left mb-2 text-base md:text-lg">
              Certain features of the Site may permit users to upload, submit,
              and post content to the Site, including messages, reviews, data,
              text, and other types of works{" "}
              <span className="font-bold">("User Content")</span> and to publish
              User Content on the Site. You are responsible for all User Content
              that you post on or transmit through the Site and the consequences
              related thereto.
            </li>
          </ul>
          <p className="text-base md:text-lg mt-4 mb-2">
            Trugamer does not endorse, support, sanction, encourage, verify, or
            agree with the comments, opinions, or statements posted on forums,
            blogs, or otherwise contained in the Site and expressly disclaims
            any and all liability in connection with User Content submissions.
            Trugamer disclaims any and all liability in connection with User
            Content, and you agree that Trugamer and its third-party service
            providers are not responsible, and shall have no liability to you,
            with respect to any User Content.
          </p>
          <p className="text-base md:text-lg mt-4 mb-2">
            By providing User Content via the Site, you affirm, represent, and
            warrant that:
          </p>

          <p className="text-base md:text-lg mt-4 mb-2">
            a) you are the creator and owner of the User Content, or have the
            necessary licenses, rights, consents, and permissions to authorize
            Trugamer and users of the Site to use and distribute your User
            Content as necessary to exercise the licenses granted by you in
            these Terms, in the manner contemplated by Trugamer, the Site, and
            these Terms;
          </p>
          <p className="text-base md:text-lg mt-4 mb-2">
            b) your User Content, and the use of your User Content as
            contemplated by these Terms, does not and will not: (i) infringe,
            violate, or misappropriate any third-party right, including any
            copyright, trademark, patent, trade secret, moral right, privacy
            right, right of publicity, or any other intellectual property or
            proprietary right; (ii) slander, defame, libel, or invade the right
            of privacy, publicity or other property rights of any other person;
            (iii) contain any personal identifying information of any other
            person; or (iv) cause Trugamer to violate any law or regulation or
            otherwise cause liability for Trugamer.
          </p>
          <p className="text-base md:text-lg mt-4 mb-2">
            c) your User Content could not be deemed by a reasonable person to
            be objectionable, profane, indecent, pornographic, harassing,
            threatening, embarrassing, hateful, or otherwise inappropriate.
          </p>
          <h3 className="font-bold mt-4 text-[16px] md:text-xl text-white mb-4">
            5. LICENSE TO USER CONTENT
          </h3>
          <ul className="list-disc list-outside pl-5 mb-4">
            <li className="text-left mb-2 text-base md:text-lg">
              By posting, displaying, uploading, or providing User Content to
              the Site, you hereby grant Trugamer a perpetual, irrevocable,
              royalty-free, sublicensable, worldwide license to use, copy,
              distribute, reproduce, modify, adapt, publish, translate,
              transmit, disclose, publicly perform, and publicly display the
              User Content (in whole or in part) and to incorporate such User
              Content into other works in any format or medium now known or
              later developed for any and all commercial or non-commercial
              purposes. By providing User Content to or via the Site to other
              users of the Site, you grant those users a non-exclusive license
              to access and use that User Content as permitted by these Terms
              and the functionality of the Site.
            </li>
          </ul>
          <h3 className="font-bold mt-4 text-[16px] md:text-xl text-white mb-4">
            6. SOLE DISCRETION TO EDIT OR SCREEN USER CONTENT THIRD PARTY LINKS
          </h3>
          <ul className="list-disc list-outside pl-5 mb-4">
            <li className="text-left mb-2 text-base md:text-lg">
              Trugamer does not and cannot review or screen all User Content and
              is not in any manner responsible for the content of User Content.
              You acknowledge that by providing you with the ability to view and
              distribute User Content on the Site, Trugamer is merely acting as
              a passive conduit for such distribution and is not undertaking any
              obligation or liability relating to any contents or activities on
              the Site. Trugamer reserves the right, but undertakes no duty, to
              at any time and without prior notice review, screen, remove, edit,
              move, delete, or block any User Content, in its sole discretion,
              without notice. If at any time Trugamer chooses, in its sole
              discretion, to monitor the Site, Trugamer nonetheless assumes no
              responsibility for User Content, no obligation to modify or remove
              any inappropriate User Content, and no responsibility for the
              conduct of the user submitting any such User Content.
            </li>
            <li className="text-left mb-2 text-base md:text-lg">
              The Site may contain links to third-party websites and online
              services that are not owned or controlled by Trugamer. Trugamer
              has no control over, and assumes no responsibility for, such
              websites and online services. Be aware of the foregoing when you
              leave the Site. We suggest you read the terms and privacy policy
              of each third-party website and online service that you visit.
            </li>
          </ul>
          <h3 className="font-bold mt-4 text-[16px] md:text-xl text-white mb-4">
            7. ACCEPTABLE USE
          </h3>
          <ul className="list-disc list-outside pl-5 mb-4">
            <li className="text-left mb-2 text-base md:text-lg">
              You are responsible for your use of the Site. Our goal is to
              create a positive, useful, and safe user experience. To promote
              this goal, we prohibit certain kinds of conduct that may be
              harmful to other users or to us. When you Use the Site, you may
              not:
            </li>
            <li className="text-left mb-2 text-base md:text-lg">
              violate any law or regulation.
            </li>
            <li className="text-left mb-2 text-base md:text-lg">
              violate, infringe, or misappropriate other people's intellectual
              property, privacy, publicity, or other legal rights.
            </li>
            <li className="text-left mb-2 text-base md:text-lg">
              post or share anything that is illegal, abusive, harassing,
              pornographic, indecent, profane, obscene, hateful, racist, or
              otherwise objectionable.
            </li>
            <li className="text-left mb-2 text-base md:text-lg">
              submit, send, post, upload, or otherwise make available
              unsolicited or unauthorized advertising or commercial
              communications, such as spam, advertising, promotional materials,
              junk mail, chain letters, or any other form of solicitation
            </li>
            <li className="text-left mb-2 text-base md:text-lg">
              advertise to, or solicit, any user to buy or sell any products or
              services, or use any information obtained from the Site to
              contact, advertise to, solicit, or sell to any user without their
              prior explicit consent
            </li>
            <li className="text-left mb-2 text-base md:text-lg">
              submit any content linking to multilevel marketing schemes,
              pyramid schemes, or off-topic content.
            </li>
            <li className="text-left mb-2 text-base md:text-lg">
              engage in spidering or harvesting, or participate in the use of
              software, including spyware, designed to collect data from the
              Site.
            </li>
            <li className="text-left mb-2 text-base md:text-lg">
              alter or tamper with any Contents, information, or materials on or
              associated with the Site.
            </li>
            <li className="text-left mb-2 text-base md:text-lg">
              transmit any viruses, malicious code, or other computer
              instructions or technological means whose purpose is to disrupt,
              damage, or interfere with the use of computers or related systems.
            </li>
            <li className="text-left mb-2 text-base md:text-lg">
              post or transmit, or cause to be posted or transmitted, any
              communication or solicitation designed or intended to obtain
              password, account, or any other personally identifiable or private
              information from any user.
            </li>
            <li className="text-left mb-2 text-base md:text-lg">
              disrupt, overwhelm, attack, modify or interfere with the Site or
              its associated software, hardware, or servers in any way.
            </li>
            <li className="text-left mb-2 text-base md:text-lg">
              take any action that imposes, or may impose in our sole
              discretion, an unreasonable or disproportionately large load on
              our infrastructure.
            </li>
            <li className="text-left mb-2 text-base md:text-lg">
              impede or interfere with others' Use of the Site.
            </li>
            <li className="text-left mb-2 text-base md:text-lg">
              abuse, defame, threaten, intimidate, stalk, harass, or harm
              another individual.
            </li>
            <li className="text-left mb-2 text-base md:text-lg">
              impersonate any person or entity or perform any other similar
              fraudulent activity, such as phishing.
            </li>
            <li className="text-left mb-2 text-base md:text-lg">
              use any robots, spiders, scrapers, or any other automated means to
              access the Site for any purpose.
            </li>
            <li className="text-left mb-2 text-base md:text-lg">
              use any means to scrape or crawl any web pages contained on the
              Site.
            </li>
            <li className="text-left mb-2 text-base md:text-lg">
              attempt to circumvent any technological measure implemented by us
              or any of our providers or any other third party (including
              another user) to protect or restrict access to the Site.
            </li>
            <li className="text-left mb-2 text-base md:text-lg">
              attempt to decipher, decompile, disassemble, or reverse engineer
              any of the software or other underlying code used to provide the
              Site.
            </li>
            <li className="text-left mb-2 text-base md:text-lg">
              advocate, encourage, or assist any third party in doing any of the
              foregoing.
            </li>
          </ul>
          <h3 className="font-bold mt-4 text-[16px] md:text-xl text-white mb-4">
            8. TERMINATION
          </h3>
          <ul className="list-disc list-outside pl-5 mb-4">
            <li className="text-left mb-2 text-base md:text-lg">
              These Terms constitute an agreement that is effective unless and
              until terminated by Trugamer. Trugamer may, at its sole
              discretion, terminate these Terms or your account on the Site, or
              suspend or terminate your access to the Site, at any time for any
              reason or no reason, with or without notice. You may terminate
              your account at any time by contacting Trugamer customer service.
              If in Trugamer’s sole discretion you fail to comply with any term
              or provision of these Terms, Trugamer may terminate your Account
              and deny you access to the Site. In the event of denial of access
              by Trugamer, you are no longer authorized to access the Site. Upon
              termination of these Terms: (a) you must immediately cease Use of
              the Site; (b) you will no longer be authorized to access your
              Account or the Site; and (c) all provisions of these Terms which
              are by their nature intended to survive termination shall survive
              termination.
            </li>
          </ul>
          <h3 className="font-bold mt-4 text-[16px] md:text-xl text-white mb-4">
            9. DISCLAIMER; LIMITATION OF LIABILITY & INDEMNITY
          </h3>
          <ul className="list-disc list-outside pl-5 mb-4">
            <li className="text-left mb-2 text-base md:text-lg">
              THIS SITE, ALL CONTENTS, AND ALL SERVICES MADE AVAILABLE THROUGH
              THE SITE ARE PROVIDED ON AN "AS IS" BASIS. TRUGAMER DISCLAIMS ALL
              WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING
              WITHOUT LIMITATION, IMPLIED WARRANTIES OF MERCHANTABILITY AND
              FITNESS FOR A PARTICULAR PURPOSE. TRUGAMER DOES NOT WARRANT THAT
              YOUR USE OF THIS SITE WILL BE UNINTERRUPTED OR ERROR-FREE, OR THAT
              THIS SITE OR ITS SERVER ARE FREE OF VIRUSES OR OTHER HARMFUL
              ELEMENTS. ALTHOUGH NORDSTROM ENDEAVORS TO PROVIDE ACCURATE
              INFORMATION, IT DOES NOT WARRANT OR MAKE ANY REPRESENTATIONS
              REGARDING THE ACCURACY OR RELIABILITY OF INFORMATION ON THIS
              SITE. 
            </li>
          </ul>
          <p className="text-base md:text-lg mt-4 mb-2">
            YOUR USE OF THE SITE IS AT YOUR OWN RISK. NEITHER TRUGAMER OR ANY
            RELATED ENTITIES OR CONTENT PROVIDERS SHALL BE LIABLE TO ANY PERSON
            OR ENTITY FOR ANY DIRECT OR INDIRECT LOSS, DAMAGE (WHETHER ACTUAL,
            CONSEQUENTIAL, PUNITIVE, SPECIAL OR OTHERWISE), INJURY, CLAIM, OR
            LIABILITY OF ANY KIND OR CHARACTER WHATSOEVER BASED UPON OR
            RESULTING FROM YOUR USE OR INABILITY TO USE THIS SITE OR SERVICES,
            OR ANY INFORMATION OR MATERIALS PROVIDED ON THE SITE.
          </p>
          <p className="text-base md:text-lg mt-4 mb-2">
            TRUGAMER IS NOT LIABLE FOR ANY DEFAMATORY, OFFENSIVE OR ILLEGAL
            CONDUCT OF ANY USER. IF YOU ARE DISSATISFIED WITH THE SITE OR ANY
            MATERIALS ON THE SITE, OR ANY SERVICES, OR WITH ANY OF TRUGAMER’S
            TERMS, YOUR SOLE AND EXCLUSIVE REMEDY IS TO DISCONTINUE USING THE
            SITE AND SERVICES.
          </p>
          <p className="text-base md:text-lg mt-4 mb-2">
            YOU AGREE TO INDEMNIFY, DEFEND AND HOLD HARMLESS TRUGAMER AND ITS
            AFFILIATES, AND THEIR RESPECTIVE SHAREHOLDERS, OFFICERS, DIRECTORS,
            EMPLOYEES, AGENTS, DISTRIBUTORS, VENDORS AND AFFILIATES FROM AND
            AGAINST ANY AND ALL THIRD-PARTY CLAIMS, DEMANDS, LIABILITIES, COSTS
            OR EXPENSES, INCLUDING REASONABLE ATTORNEYS' FEES, RESULTING OR
            ARISING OUT OF YOUR BREACH OF THESE TERMS OR ANY ACTIVITY RELATED TO
            YOUR ACCOUNT (INCLUDING NEGLIGENT OR WRONGFUL CONDUCT).
          </p>
          <p className="text-base md:text-lg mt-4 mb-2">
            If any part of these warranty disclaimers or limitations of
            liability is found to be invalid or unenforceable for any reason or
            if we are otherwise found to be liable to you in any manner, then
            our aggregate liability for all claims under such circumstances
            shall not exceed the amount paid by you to Trugamer through the Site
            during the prior six (6) months.
          </p>
          <p className="text-base md:text-lg mt-4 mb-2">
            Some jurisdictions do not allow the exclusion of certain warranties
            or the limitation or exclusion of liability for damages.
            Accordingly, some of the above indemnities, limitations, and
            disclaimers may not apply to you. To the extent we may not, as a
            matter of applicable law, disclaim any warranty or limit our
            liability, the scope and duration of such warranty and the extent of
            our liability will be the minimum permitted under such law.
          </p>
          <h3 className="font-bold mt-4 text-[16px] md:text-xl text-white mb-4">
            10. APPLICABLE LAW AND VENUE; LIMITATION OF LEGAL ACTION
          </h3>
          <ul className="list-disc list-outside pl-5 mb-4">
            <li className="text-left mb-2 text-base md:text-lg">
              The law applicable to the interpretation and construction of these
              Terms and the relationship between you and Trugamer shall be the
              laws of the State of Nevada, without regard to principles of
              conflict of laws. You agree that all matters relating to your
              access to or Use of the Site, including all disputes, will be
              governed by the laws of the State of Nevada. You and Trugamer
              consent to the jurisdiction of the federal or state courts of
              Clark County, Nevada and waive any objections as to personal
              jurisdiction or as to the laying of venue in such courts due to
              inconvenient forum or any other basis or any right to seek to
              transfer or change venue of any such action to another court.
            </li>
            <li className="text-left mb-2 text-base md:text-lg">
              YOU AND TRUGAMER AGREE THAT ANY CAUSE OF ACTION ARISING OUT OF OR
              RELATED TO THE SERVICES MUST COMMENCE WITHIN ONE (1) YEAR AFTER
              THE CAUSE OF ACTION ACCRUES. OTHERWISE, SUCH CAUSE OF ACTION IS
              PERMANENTLY BARRED.
            </li>
          </ul>
          <h3 className="font-bold mt-4 text-[16px] md:text-xl text-white mb-4">
            11. ADDITIONAL TERMS; MISCELLANEOUS
          </h3>
          <ul className="list-disc list-outside pl-5 mb-4">
            <li className="text-left mb-2 text-base md:text-lg">
              Please review our other terms and policies posted on the Site,
              including the{" "}
              <a
                className="font-bold text-cBlue-main hover:text-cBlue-main capitalize"
                rel="nofollow"
                target="_blank"
                href="/privacy-policy"
              >
                Privacy Policy
              </a>{" "}
              ("Additional Terms"). The Additional Terms also govern your use of
              the Site and are incorporated by reference into, and made a part
              of, these Terms. These Terms constitute the entire agreement
              between you and Trugamer relating to the subject matter addressed
              herein.
            </li>
          </ul>
          <p className="text-base md:text-lg mt-4 mb-2">
            We reserve the right to modify, suspend, or discontinue the Site and
            any Service, content, or features offered through the Site at any
            time, without notice to you. We will have no liability to you or any
            third party for modification, suspension, or discontinuance of the
            Site, or any service, content, or feature offered through the Site.
          </p>
          <p className="text-base md:text-lg mt-4 mb-2">
            We reserve the right to make changes to these Terms at any time, and
            such changes will be effective immediately upon being posted on the
            Site. Each time you use the Site, you should review the current
            Terms. Your continued use of the Site will constitute your
            acceptance of the current Terms.
          </p>
          <p className="text-base md:text-lg mt-4 mb-2">
            The paragraph or section titles in these Terms are for convenience
            only and have no legal or contractual effect.
          </p>
          <p className="text-base md:text-lg mt-4 mb-2">
            If any part of these Terms is held to be invalid or unenforceable,
            the unenforceable part will be given effect to the greatest extent
            possible, and the remaining parts will remain in full force and
            effect.
          </p>
          <p className="text-base md:text-lg mt-4 mb-2">
            Under no circumstances will we be held liable for any delay or
            failure in performance due in whole or in part to any acts of nature
            or other causes beyond our reasonable control. The failure by us to
            enforce any right or provision of these Terms will not prevent us
            from enforcing such right or provision in the future.
          </p>
          <p className="text-base md:text-lg mt-4 mb-2">
            You may not assign or transfer these Terms or your rights under
            these Terms, in whole or in part, by operation of law or otherwise,
            without Trugamer’s prior written consent. We may assign the Terms
            and our rights and obligations under these Terms, including in
            connection with a merger, acquisition, sale of assets or equity, or
            by operation of law. You agree that communications and transactions
            between us may be conducted electronically.
          </p>
          <h3 className="font-bold mt-4 text-[16px] md:text-xl text-white mb-4">
            12. NOTICE TO CALIFORNIA USERS
          </h3>
          <ul className="list-disc list-outside pl-5 mb-4">
            <li className="text-left mb-2 text-base md:text-lg">
              Pursuant to California Civil Code Section 1789.3, California users
              of the Services are entitled to the following specific consumer
              rights notice: The Complaint Assistance Unit of the Division of
              Consumer Services of the California Department of Consumer Affairs
              may be contacted in writing at Consumer Information Center, 1625
              North Market Boulevard, Suite N 112, Sacramento, California 95834,
              by telephone at (800) 952-5210, or online at{" "}
              <a
                className="text-cBlue-main hover:text-cBlue-main break-all"
                rel="nofollow"
                target="_blank"
                href="https://www.dca.ca.gov/webapplications/apps/complaint/index.shtml"
              >
                https://www.dca.ca.gov/webapplications/apps/complaint/index.shtml
              </a>
              .
            </li>
          </ul>
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

export default TermCondition;
