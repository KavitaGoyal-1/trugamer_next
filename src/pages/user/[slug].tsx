import Footer from "@/components/layouts/footer";
import FooterDetailed from "@/components/layouts/footer-detailed";
import NavigationPublic from "@/components/layouts/navigation-public";
import Visitor from "@/components/visitor";
import { getToken } from "@/utills/cookies";

const VisitProfile = () => {
  const token = getToken();

  return (
    <>
      <div>
        <NavigationPublic token={token} />
        <Visitor />
        <div className="max-md:hidden">
          <Footer />
        </div>
        <div className="md:hidden block">
          <FooterDetailed />
        </div>
      </div>
    </>
  );
};

export default VisitProfile;
