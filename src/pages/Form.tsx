import MultiSelect from "@/components/MultiSelect";
import { emails } from "@/utils/email";
import { BASE_URL, BASE_URL2 } from "@/utils/funcitons";
import { useUser } from "@clerk/clerk-react";
import { Select, SelectItem, select } from "@nextui-org/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { get } from "react-scroll/modules/mixins/scroller";
import { toast } from "sonner";
import Cards from '../components/Cards';

export interface ElementType {
  text: string;
  placeholder: string;
  gpt: string;
  type: string;
  options: string[];
  required: boolean;
  otherType?: string;
}



const Form = () => {
  // State for form fields
  const [description, setDescription] = useState("");
  const { isLoaded, isSignedIn, user } = useUser();
  const navigate = useNavigate()
  const [name, setName] = useState("");
  const [accoName, setaccoName] = useState("");
  const [template, setTemplate] = useState("");
  const [selectedLabel, setSelectedLabel] = useState([]);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [access, setAccess] = useState(false)
  const [cards, setCards] = useState([])
  const [labels, setLabels] = useState<string[]>([
    "All Tools",
    "In Demand Tools",
    "Social Media Bio's",
    "My Tools",
    "Social Media Posts",
    "SEO Tools",
    "Website Tools",
    "Paid Ad Tools",
    "Image Generator",
    "Image Resizers",
    "Language Translator",
    "Video Downloaders",
    "Email Tools",
    "Paraphrase Tools",
    "Blog Creator",
    "Audio Tools",
    "Article Creator",
    "Newsletters",
    "Press Releases",
    "Facebook Post Caption Generator",
    "Facebook Group Post Generator",
    "Facebook Group Description Generator",
    "Instagram Post Caption Generator",
    "Instagram Reel Caption Generator",
    "Instagram Story Caption Generator",
    "Youtube Post Title Generator",
    "Youtube Post Description Generator",
    "Threads Post Caption Generator",
    "Upcoming Tools",
  ]);
  const [images, setImages] = useState<string[]>([
    "https://uploads-ssl.webflow.com/64dc619021257128d0687cce/6512589c982265fa7120a132_ico-X.svg",
    "https://uploads-ssl.webflow.com/64dc619021257128d0687cce/6512c9ab339d227090291504_ico-Facebook.svg",
    "https://uploads-ssl.webflow.com/64dc619021257128d0687cce/6512c9f5bcb88ff4f70e0862_ico-Insta.svg",
    "https://uploads-ssl.webflow.com/64dc619021257128d0687cce/6512ca25c32768a723b2d855_ico-TikTok.svg",
    "https://uploads-ssl.webflow.com/64dc619021257128d0687cce/6512d8dd24a0261059ca0b40_logo-threads.svg",
    "https://uploads-ssl.webflow.com/64dc619021257128d0687cce/6512cabdd40cdffceaac8fd7_ico-LinkedIn.svg",
    "https://uploads-ssl.webflow.com/64dc619021257128d0687cce/6512cd892a8bf792f30f0f9e_ico-Blog.svg",
    "https://uploads-ssl.webflow.com/64dc619021257128d0687cce/6512ce3eeacee2651ee85725_ico-SEO-n-site.svg",
    "https://uploads-ssl.webflow.com/64dc619021257128d0687cce/6512cefade02f68397df8c82_ico-Pintrest.svg",
    "https://uploads-ssl.webflow.com/64dc619021257128d0687cce/6512cfc26e3ee8ff26a2185b_ico-YouTube.svg",
    "https://uploads-ssl.webflow.com/64dc619021257128d0687cce/6512d0a70d6cfa37db7e93fd_ico-Email.svg",
    "https://uploads-ssl.webflow.com/64dc619021257128d0687cce/6512d2e9bcb88ff4f718f8cf_ico-Marketing.svg",
  ]);
  const [groups, setGroups] = useState<ElementType[][]>([]);
  const [groupBy, setgroupBy] = useState("")

  const [faqs, setFaqs] = useState([]); // State for FAQs
  const [newLink, setNewLink] = useState<String>();
  const urlParams = new URLSearchParams(window.location.search);

  const id = urlParams.get("id");
console.log(cards)

  useEffect(() => {
    document.documentElement.classList.remove("dark");
    getTemplates();
  }, []);

  useEffect(() => {
    // if (isLoaded && !isSignedIn) {
    //   navigate("/login");
    //   toast.error("Login to continue...");
    // }
    // if (isSignedIn) {
    //   let canAccess = false
    //   user.emailAddresses.forEach(e => {
    //     if (emails.includes(e.emailAddress)) canAccess = true
    //   })
    //   if (!canAccess) {
    //     navigate("/")
    //     toast.error("Cannot access ")
    //     return;
    //   }
    //   setAccess(canAccess)

    // }
    setAccess(true)
  }, [isLoaded, isSignedIn]);

  const getData = async () => {
    const res = await axios.get(`${BASE_URL2}/objects/getObject/${id}`);
    const data = res.data.message.object;

    setName(data.name);
    setaccoName(data.accoName)
    setDescription(data.description);
    setTemplate(data.templete);
    setSelectedLabel(data.labels);
    setgroupBy(data.groupBy)
    setGroups(data.groups)
    setFaqs(data.faq)
    setSelectedImage(
      data.logo.replace(
        "http://localhost:4000",
        "https://social-media-ai-content-api.onrender.com"
      )
    );
    setFaqs(data.faq);
  };

  useEffect(() => {
    if (!id) return;
    window.scrollTo(0, 0);
    getData();
  }, [id]);

  const getTemplates = async () => {
    const selectedButton = "All Tools"
    let url = `${BASE_URL2}/objects/getObjectByLabel/${selectedButton}`;

    if (isSignedIn)
      url = `${BASE_URL2}/objects/getObjectByLabel/${selectedButton}?clerkId=${user.id}&name=${user?.fullName}&email=${user?.primaryEmailAddress?.emailAddress}&imageUrl=${user?.imageUrl}`;
    const res = await axios.get(url);
    setCards(res.data.message);
    // setIsLoading(false);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Perform form submission logic here

    const groupsSubmitted = groups.map((group) => {
      return group.map((element) => {
        return {
          ...element,
          options: element.options.filter((option) => option !== ""),
          type: element.type === "other" ? element.otherType : element.type,
        };
      })
    });


    
    
    try {
      let url = `https://social-media-ai-content-api.onrender.com/api/v2/objects/addObjectOnce`;
      let res
      if (!!id) {
        url = `${BASE_URL2}/objects/updateObject/${id}`;
        res = await axios.put(url, {
          name,
          accoName,
          description,
          tagLine: template,
          labels: selectedLabel,
          logo: selectedImage,
          accoLogo: selectedImage,
          faq: faqs,
          groups: groupsSubmitted,
          groupBy,
        });
      }
      else {

        res = await axios.post(url, {
          name,
          accoName,
          description,
          tagLine: template,
          labels: selectedLabel,
          logo: selectedImage,
          accoLogo: selectedImage,
          faq: faqs,
          groups: groupsSubmitted,
          groupBy,
        });
      }
      if (res.status === 201) {
        toast.success(" success: " + res.data.message._id);
        navigator.clipboard.writeText(res.data.message._id);
      }
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };
  const handeIdChange = (e:string) => {
    //set e as id in query param
    navigate(`/form?id=${e}`,{replace:true})
  };

  const handleDelete = async () => {
    try {
      const res = await axios.delete(`${BASE_URL}/templates/delete/${id}`);
      // Perform any additional logic after deletion
    } catch (error) {
      console.error("Error making DELETE request:", error);
    }
  };

  //@ts-ignore
  const handleFaqChange = (index, key, value) => {
    const updatedFaqs = [...faqs];
    //@ts-ignore

    updatedFaqs[index][key] = value;
    setFaqs(updatedFaqs);
  };

  const handleAddFaq = () => {
    //@ts-ignore
    setFaqs([...faqs, { question: "", answer: "" }]);
  };

  const handleRemoveFaq = (index: any) => {
    const updatedFaqs = [...faqs];
    updatedFaqs.splice(index, 1);
    setFaqs(updatedFaqs);
  };

  const handleAddGroup = () => {
    setGroups([...groups, []]);
  };

  const addElementToGroup = (groupIndex: number): void => {
    const updatedGroups = [...groups];
    updatedGroups[groupIndex] = [
      ...updatedGroups[groupIndex],
      {
        text: "",
        placeholder: "",
        gpt: "",
        type: "",
        options: [],
        required: true,
      },
    ];
    setGroups(updatedGroups);
  };
  const addOptions = (groupIndex: number, elementIndex: number): void => {
    const updatedGroups = [...groups];
    updatedGroups[groupIndex][elementIndex].options.push("");
    setGroups(updatedGroups);
  };

  const handleChange = (
    groupIndex: number,
    elementIndex: number,
    key: string,
    value: string | boolean
  ) => {
    const updatedGroups = [...groups];
    // @ts-ignore
    updatedGroups[groupIndex][elementIndex][key] = value;
    setGroups(updatedGroups);
  };
  const handleOptionChange = (
    groupIndex: number,
    elementIndex: number,
    optionNumber: number,
    value: string
  ) => {
    const updatedGroups = [...groups];
    // @ts-ignore
    updatedGroups[groupIndex][elementIndex].options[optionNumber] = value;
    setGroups(updatedGroups);
  };


  const removeElementFromGroup = (
    groupIndex: number,
    elementIndex: number
  ): void => {
    const updatedGroups = [...groups];
    updatedGroups[groupIndex].splice(elementIndex, 1);
    setGroups(updatedGroups);
  };

  // Function to remove a group
  const removeGroup = (groupIndex: number): void => {
    const updatedGroups = [...groups];
    updatedGroups.splice(groupIndex, 1);
    setGroups(updatedGroups);
  };

  return (
    <div className="max-w-md mx-auto flex flex-col gap-3">
      {access && (
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Acco Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              placeholder="Name"
              value={accoName}
              onChange={(e) => setaccoName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="description"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="template"
            >
              Tagline
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="template"
              type="text"
              placeholder="Template"
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="label"
            >
              Select Label
            </label>
            <MultiSelect
              placeholder="Select Label"
              options={labels}
              chips={selectedLabel}
              //@ts-ignore
              setChips={setSelectedLabel}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="image"
            >
              Select Image
            </label>
            <Select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="image"
              value={selectedImage}
              selectionMode="single"
              onSelectionChange={(e: any) => {
                // console.log(e)
                setSelectedImage(e.currentKey);
              }}
              // label="Select Image"
            >
              {/* @ts-ignore */}
              {/* Dropdown options for images */}
              {images.map((image, index) => (
                <SelectItem key={image} value={image}>
                  <img src={image} />
                </SelectItem>
              ))}
            </Select>
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="image"
            >
              GroupBy
            </label>
            <Select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="image"
              value={groupBy}
              selectionMode="single"
              onSelectionChange={(e: any) => {
                // console.log(e)
                setgroupBy(e.currentKey);
              }}
              // label="Select Image"
            >
              {/* @ts-ignore */}
              {/* Dropdown options for images */}
              {selectedLabel.map((label, index) => (
                <SelectItem key={label} value={label}>
                  {label}
                </SelectItem>
              ))}
            </Select>
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="image"
            >
              Or Add New Image Url
            </label>
            {/* @ts-ignore */}
            <input
              type="text"
              value={newLink as string}
              onChange={(e) => setNewLink(e.target.value)}
              className="bg-gray-100 p-2"
            />
            <button
              className="bg-blue-400 p-1 text-white rounded-lg ml-2"
              onClick={() => {
                {
                  /* @ts-ignore */
                }
                setSelectedImage(newLink as string);
                {
                  /* @ts-ignore */
                }
                setImages([...images, newLink as string]);
              }}
            >
              Add
            </button>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              FAQs
            </label>
            {faqs.map((faq: any, index) => (
              <div key={index} className="mb-2">
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Question"
                  value={faq.question}
                  onChange={(e) =>
                    handleFaqChange(index, "question", e.target.value)
                  }
                />
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Answer"
                  value={faq.answer}
                  onChange={(e) =>
                    handleFaqChange(index, "answer", e.target.value)
                  }
                />
                <button
                  type="button"
                  onClick={() => handleRemoveFaq(index)}
                  className="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddFaq}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Add FAQ
            </button>
          </div>

          <div className="flex flex-col gap-4 w-full my-4">
            {groups.map((group, index) => (
              <div className="flex flex-col gap-4 w-full rounded-md border border-black p-2">
                <h1>Group:{index + 1}</h1>
                {group.map((element, elementIndex) => (
                  <div className="flex flex-col gap-4 w-full border border-black p-2 rounded-3">
                    <h1>Element:{elementIndex + 1}</h1>
                    <label htmlFor={`text-${index}-${elementIndex}`}>
                      Text:
                    </label>
                    <input
                      id={`text-${index}-${elementIndex}`}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder="Text"
                      value={element.text}
                      onChange={(e) =>
                        handleChange(
                          index,
                          elementIndex,
                          "text",
                          e.target.value
                        )
                      }
                    />
                    <label htmlFor={`placeholder-${index}-${elementIndex}`}>
                      Placeholder:
                    </label>
                    <input
                      id={`placeholder-${index}-${elementIndex}`}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder="Placeholder"
                      value={element.placeholder}
                      onChange={(e) =>
                        handleChange(
                          index,
                          elementIndex,
                          "placeholder",
                          e.target.value
                        )
                      }
                    />
                    <label htmlFor={`gpt-${index}-${elementIndex}`}>GPT:</label>
                    <input
                      id={`gpt-${index}-${elementIndex}`}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder="GPT"
                      value={element.gpt}
                      onChange={(e) =>
                        handleChange(index, elementIndex, "gpt", e.target.value)
                      }
                    />
                    <label htmlFor={`type-${index}-${elementIndex}`}>
                      Type:
                    </label>
                    <select
                      id={`type-${index}-${elementIndex}`}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={element.type}
                      onChange={(e) =>
                        handleChange(
                          index,
                          elementIndex,
                          "type",
                          e.target.value
                        )
                      }
                    >
                      <option value="text">Text</option>
                      <option value="select">Select</option>
                      <option value="textarea">Textarea</option>
                      <option value="switch">switch</option>
                      <option value="input">input</option>
                      <option value="tone">tone</option>
                      <option value="other">Other</option>
                    </select>
                    {element.type === "other" && (
                      <textarea
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Type"
                        value={element.otherType} // Use a separate value for the text area
                        onChange={
                          (e) =>
                            handleChange(
                              index,
                              elementIndex,
                              "otherType",
                              e.target.value
                            ) // Update otherType instead of type
                        }
                      />
                    )}

                    <div className="flex flex-col gap-4 w-full">
                      <h1>options:</h1>
                      {element.options.map((option, optionIndex) => (
                        <input
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          placeholder="Option"
                          value={option}
                          onChange={(e) =>
                            handleOptionChange(
                              index,
                              elementIndex,
                              optionIndex,
                              e.target.value
                            )
                          }
                        />
                      ))}
                      <button
                        type="button"
                        onClick={() => addOptions(index, elementIndex)}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Add Option
                      </button>

                      <div className="flex flex-row justify-start gap-2">
                        <label htmlFor={`required-${index}-${elementIndex}`}>
                          Required:
                        </label>
                        <input
                          type="checkbox"
                          id={`required-${index}-${elementIndex}`}
                          checked={element.required}
                          onChange={() =>
                            handleChange(
                              index,
                              elementIndex,
                              "required",
                              !element.required
                            )
                          }
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          removeElementFromGroup(index, elementIndex)
                        }
                        className="bg-blue-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Remove Element
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addElementToGroup(index)}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                  Add Element
                </button>
                <button
                  type="button"
                  onClick={() => removeGroup(index)}
                  className="bg-blue-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                  Remove Group
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddGroup}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Add Group
            </button>
          </div>

          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Submit
            </button>
          </div>
        </form>
      )}
      {access && id && (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
          onClick={() => handleDelete()}
        >
          Delete
        </button>
      )}

      {/* <Select onValueChange={(e) => handeIdChange(e)}>
        <SelectTrigger
          className="capitalize self-start min-w-[300px] max-w-[844px] "
          value={id ?? undefined}
          // @ts-ignore
        >
          <SelectValue placeholder={"Select Tone "} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{"Choose a Tone"}</SelectLabel>
            {cards.map((option: { _id: string; name: string }) => (
              <SelectItem value={option._id} className="capitalize">
                {option.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select> */}

      <Select
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="image"
        value={id ?? undefined}
        selectionMode="single"
        onSelectionChange={(e: any) => {
          // console.log(e)
          handeIdChange(e.currentKey);
        }}
        // label="Select Image"
      >
        {/* @ts-ignore */}
        {/* Dropdown options for images */}
        {cards.map((option: { _id: string; name: string }) => (
          <SelectItem key={option._id} value={option._id} className="capitalize">
            {option.name}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
};

export default Form;
