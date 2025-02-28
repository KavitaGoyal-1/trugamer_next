import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import PageLayout from "@/components/layouts/page-layout";
import { getTags, postArticle } from "@/services/news";
import { uploadImage } from "@/utills/upload-image";
import { getToken } from "@/utills/cookies";
import TagComponent from "@/components/tags/tag-component";
import Image from "next/image";

function convertToSlug(Text: string) {
  return Text.toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
}

const NewsForm = () => {
  const [imagePreview, setPreview] = useState<any>("");
  const router = useRouter();
  const user = useSelector((state: any) => state?.authState?.userData);
  const [buttonloading, setbuttonloading] = useState(false);
  const imageUpload = async (e: any) => {
    try {
      const apiResponse: any = await uploadImage(e, `${token}`);

      return apiResponse?.response?.data && apiResponse?.response?.data[0];
    } catch (error) {
      console.log(error);
    }
  };

  const handleNavigateToSubmitArticle = () => {
    router.push("/news");
  };

  const formik = useFormik({
    initialValues: {
      title: "",
      link: "",
      description: "",
      image: null, // New field for image upload
      tags: [], // New field for tags
    },
    onSubmit: async (values) => {
      if (!user) return;
      if (values.image) {
        try {
          setbuttonloading(true);
          const image = await imageUpload(values.image);
          const formData = {
            data: {
              title: values.title,
              link: values.link,
              coverImage: { id: image?.id }, // You can modify this as needed
              description: values.description,
              slug: convertToSlug(values.title),
              news_tags: values.tags,
              author: {
                name: user?.name,
                avatar: user?.picture?.url,
              },
              publishedAt: null,
              // You can modify this as needed
            },
          };
          const response = await postArticle(formData);

          if (response) {
            formik.resetForm();
            setMyTags([]);
            setbuttonloading(false);
            handleNavigateToSubmitArticle();
          } else {
            toast.error("Something went wrong", { toastId: "7" });
          }

          /*    } */
        } catch (error) {
          console.error(error);
          setbuttonloading(false);
        }
      }
    },
  });

  const token = getToken();
  const [apidata, setdata] = useState<any>("");
  let dropdowndata = [];

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getTags();
        setdata(data.data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, []);

  if (apidata) {
    for (let i = 0; i < apidata.length; i++) {
      let id = apidata[i].id;
      let tag = apidata[i].attributes.tag;
      dropdowndata.push({ id, tag });
    }
  }

  const [rotate, setrotate] = useState<boolean>(false);
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [myTags, setMyTags] = useState<any>([]);

  const transform = () => {
    setrotate(!rotate);
    setShowOptions(!rotate);
  };

  const addTag = (newTag: any) => {
    setMyTags([...myTags, newTag]);
  };

  const handleAddTag = (id: number, tag: string) => {
    setShowOptions(false);
    setrotate(!rotate);
    const idExists = myTags.some((existingTag: any) => existingTag.id === id);

    if (!idExists) {
      const newTag = { id: id, tag: tag };
      addTag(newTag);
      const updatedTags = [...formik.values.tags, { id, tag }];
      formik.setFieldValue("tags", updatedTags);
    }
  };

  const handleRemoveTag = (id: number) => {
    const updatedTags = myTags.filter((tag: any) => tag.id !== id);
    setMyTags(updatedTags);
    const updatedFormikTags = formik.values.tags.filter(
      (tag: any) => tag.id !== id
    );
    formik.setFieldValue("tags", updatedFormikTags);
  };

  return (
    <PageLayout title="Create An Article">
      <div className="p-4 rounded-lg  max-w-4xl mx-auto">
        <form onSubmit={formik.handleSubmit}>
          <div className="flex flex-wrap -mx-2 mb-4">
            {/* First pair of form elements */}
            <div className="w-full md:w-1/2 px-2">
              <label
                htmlFor="title"
                className="block  text-[14px] font-medium  mb-2 text-start"
              >
                Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.title}
                placeholder="Enter title"
                className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500 text-gray-700"
              />
            </div>

            <div className="w-full md:w-1/2 px-2">
              <label
                htmlFor="link"
                className="block  text-[14px] font-medium  mb-2 text-start"
              >
                Link
              </label>
              <input
                id="link"
                name="link"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.link}
                placeholder="Enter link"
                className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500 text-gray-700"
              />
            </div>

            <div className="w-full md:w-1/2 px-2 mt-4">
              <label
                htmlFor="imageUpload"
                className="block  text-[14px] font-medium  mb-2 text-start"
              >
                Cover Image
              </label>
              <div
                className={`h-40 bg-white rounded-lg grid place-items-center place-content-center `}
              >
                <input
                  type="file"
                  className="bg-red-300"
                  hidden
                  /* onChange={(e: any) => imageUpload(e.target.files[0])} */

                  onChange={(e) => {
                    const selectedFile = e.target.files?.[0];
                    if (selectedFile) {
                      formik.setFieldValue("image", selectedFile);
                      setPreview(URL.createObjectURL(selectedFile));
                    } else {
                      formik.setFieldValue("image", null);
                    }
                  }}
                  id="imageUpload"
                />
                <label htmlFor="imageUpload">
                  {!imagePreview ? (
                    <div className="h-[130px] grid grid-cols-1 grid-rows-[max-content_1fr] gap-y-3 justify-items-center">
                      <Image
                        src="/icons/upload-cloud.svg"
                        alt="Upload Icon"
                        title="Upload Icon"
                        height={40}
                        width={40}
                      />
                      <p className="text-cGray-500 text-sm text-center">
                        <span className="text-cBlue-light font-semibold">
                          Click to upload
                        </span>{" "}
                        <br />
                        SVG, PNG, JPG, or GIF (max. 800x800px)
                      </p>
                    </div>
                  ) : (
                    <div className="h-[110px] grid grid-cols-1 grid-rows-[max-content_1fr] gap-y-3 justify-items-center">
                      <Image
                        src={imagePreview}
                        alt="Upload Icon"
                        title="Upload Icon"
                        height={80}
                        width={100}
                        className="h-[110px] w-auto"
                      />
                    </div>
                  )}
                </label>
              </div>
            </div>

            <div className="w-full md:w-1/2 px-2 mt-4">
              <label
                htmlFor="description"
                className="block  text-[14px] font-medium  mb-2 text-start"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={6}
                placeholder="Enter description"
                onChange={formik.handleChange}
                value={formik.values.description}
                className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500 text-gray-700"
              ></textarea>
            </div>

            <div className="flex flex-row ml-2 mt-2 items-center ">
              <h1 className="block  text-[14px] font-medium  mb-2 text-start">
                Tag
              </h1>
              <div className="ml-2 relative">
                <button
                  type="button"
                  onClick={transform}
                  className="bg-white rounded-md"
                >
                  <div className=" flex flex-row justify-between px-2 justify-center mt-2 ">
                    <h1 className="block text-gray-700 text-sm font-bold mb-2 ml-2">
                      Add{" "}
                    </h1>
                    <svg
                      className={`h-4 w-4 ml-4 ${
                        rotate ? "transform rotate-180" : ""
                      } text-black`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </button>
                {showOptions && (
                  <div className="origin-top-right absolute mt-2 w-[100%] rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none z-10">
                    {dropdowndata.map((tag) => (
                      <a
                        key={tag.id}
                        href="#"
                        rel="nofollow"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-700 text-[14px]"
                        onClick={() => handleAddTag(tag.id, tag.tag)} // Use the tag from the array
                      >
                        {tag.tag}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-row gap-2 ml-4 mt-4">
              {myTags &&
                myTags.map((tagData: any) => (
                  <TagComponent
                    key={tagData.id}
                    tag={tagData.tag}
                    id={tagData.id}
                    onRemove={handleRemoveTag}
                  />
                ))}
            </div>
          </div>

          <button
            disabled={buttonloading}
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none "
          >
            Submit
          </button>
        </form>
      </div>
    </PageLayout>
  );
};

export default NewsForm;
