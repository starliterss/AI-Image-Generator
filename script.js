const generateForm = document.querySelector(".generate-form");
const imageGallery = document.querySelector(".image-gallery");

const OPENAI_API_KEY = "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";
let isImageGenerating = false; 

const  updateImageCard = (imgDataArray) => {
    imgDataArray.forEach((imgObject, index) => {
        const imgCard = imageGallery.querySelectorAll(".img-card")[index];
        const imgElement = imgCard.querySelector("img");
        const downloadBtn = imgCard.querySelector(".download-btn");

        // Set the images source to the AI Generated image data
        const aiGeneratedImg = `data:image/jpeg;base64,${imgObject.b64_json}`;
        imgElement.src = aiGeneratedImg;

        //When the image is loaded, remove the loading class and set to download
        imgElement.onload = () => {
            imgCard.classList.remove("loading");
            downloadBtn.setAttribute("href", aiGeneratedImg);
            downloadBtn.setAttribute("download", `${new Date().getTime()}.jpg`);
        };
    });
};

const generateAiImages = async (userPrompt, userImgQuantity) => {
    try {
        // Send request to OpenAPI API to generate the image based on the user inputs
        const response = await fetch("https://api.openai.com/v1/images/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer "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"`

            },
            body: JSON.stringify({
                prompt: userPrompt,
                n: parseInt(userImgQuantity),
                size: "512x512",
                response_format: "b64_json"
            })
        });

        if (!response.ok) {
            throw new Error("Failed to generate the images! Please try again.");
        }

        const { data } = await response.json(); //get data from the response
        updateImageCard([...data]);
    } catch (error) {
        alert(error.message);
    } finally {
        isImageGenerating = false;
    }
};

const handleFormSubmission = async (e) => {
    e.preventDefault();
    if (isImageGenerating) return;
    isImageGenerating = true;

    // Get user input and even image quantity values from the form
    const userPrompt = e.srcElement[0].value;
    const userImgQuantity = e.srcElement[1].value;

    //Creating HTML markup for the image card with loading state
    const imgCardMarkup = Array.from({ length: userImgQuantity }, () => {
        const imgCard = document.createElement("div");
        imgCard.className = "img-card loading";
    
        const imgElement = document.createElement("img");
        imgElement.src = "images/loading.svg";
        imgElement.alt = "image";
    
        const downloadBtn = document.createElement("a");
        downloadBtn.href = "#";
        downloadBtn.className = "download-btn";
    
        const downloadIcon = document.createElement("img");
        downloadIcon.src = "images/download.svg";
        downloadIcon.alt = "download icon";
    
        downloadBtn.appendChild(downloadIcon);
        imgCard.appendChild(imgElement);
        imgCard.appendChild(downloadBtn);
    
        return imgCard.outerHTML;
    }).join("");    

    imageGallery.innerHTML = imgCardMarkup;
    generateAiImages(userPrompt, userImgQuantity);
};

generateForm.addEventListener("submit", handleFormSubmission);