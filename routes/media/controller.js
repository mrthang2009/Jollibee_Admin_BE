const { Media, Category, Product, Employee } = require("../../models");
const { generateUniqueFileName } = require("../../utils");

const multer = require("multer");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const storage = multer.memoryStorage();
const upload = multer({
  storage,
});

module.exports = {
  uploadSingle: (req, res, next) => {
    upload.single("image")(req, res, async (err) => {
      try {
        if (!req.file) {
          return res.status(400).json({ message: "No image file provided" });
        }
        const S3 = new S3Client({
          region: "auto",
          endpoint: process.env.ENDPOINT,
          credentials: {
            accessKeyId: process.env.R2_ACCESS_KEY_ID,
            secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
          },
        });

        const fileName = generateUniqueFileName(req.file.originalname);

        await S3.send(
          new PutObjectCommand({
            Body: req.file.buffer,
            Bucket: "ecommerce",
            Key: fileName,
            ContentType: req.file.mimetype,
          })
        );

        const url = `${process.env.R2_DEV_URL}/ecommerce/${fileName}`;
        const media = new Media({
          coverImageUrl: url,
          size: req.file.size,
        });
        await media.save();
        // Lưu mediaId vào request
        // req.mediaId = savedMedia._id; // Sử dụng req.mediaId để lưu mediaId
        // next();
      } catch (error) {
        console.log("««««« error »»»»»", error);
        return res.status(500).json({ message: "Upload file error", error });
      }
    });
  },

  uploadImageCategory: (req, res, next) => {
    const { categoryId } = req.params;
    upload.single("image")(req, res, async (err) => {
      try {
        if (!req.file) {
          return res.status(400).json({ message: "No image file provided" });
        }
        const S3 = new S3Client({
          region: "auto",
          endpoint: process.env.ENDPOINT,
          credentials: {
            accessKeyId: process.env.R2_ACCESS_KEY_ID,
            secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
          },
        });

        const fileName = generateUniqueFileName(req.file.originalname);

        await S3.send(
          new PutObjectCommand({
            Body: req.file.buffer,
            Bucket: "ecommerce",
            Key: fileName,
            ContentType: req.file.mimetype,
          })
        );

        const url = `${process.env.R2_DEV_URL}/ecommerce/${fileName}`;

        // Truy vấn để lấy tên danh mục từ categoryId
        const category = await Category.findById(categoryId);

        if (!category) {
          return res.status(404).json({ message: "Category not found" });
        }

        const media = new Media({
          coverImageUrl: url,
          size: req.file.size,
          categoryId: categoryId,
        });

        const payload = await media.save();

        return res.status(200).json({ message: "Tải lên thành công", payload });
      } catch (error) {
        console.log("««««« error »»»»»", error);
        return res.status(500).json({ message: "Upload file error", error });
      }
    });
  },

  uploadImageProduct: (req, res, next) => {
    const { productId } = req.params;
    upload.single("image")(req, res, async (err) => {
      try {
        if (!req.file) {
          return res.status(400).json({ message: "No image file provided" });
        }
        const S3 = new S3Client({
          region: "auto",
          endpoint: process.env.ENDPOINT,
          credentials: {
            accessKeyId: process.env.R2_ACCESS_KEY_ID,
            secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
          },
        });

        const fileName = generateUniqueFileName(req.file.originalname);

        await S3.send(
          new PutObjectCommand({
            Body: req.file.buffer,
            Bucket: "ecommerce",
            Key: fileName,
            ContentType: req.file.mimetype,
          })
        );

        const url = `${process.env.R2_DEV_URL}/ecommerce/${fileName}`;

        const product = await Product.findById(productId);

        if (!product) {
          return res.status(404).json({ message: "Product not found" });
        }

        const media = new Media({
          name: `${product.name} cover photo`,
          coverImageUrl: url,
          size: req.file.size,
          productId: productId,
        });

        const payload = await media.save();

        return res.status(200).json({ message: "Tải lên thành công", payload });
      } catch (error) {
        console.log("««««« error »»»»»", error);
        return res.status(500).json({ message: "Upload file error", error });
      }
    });
  },

  uploadAvatarMe: (req, res, next) => {
    upload.single("avatar")(req, res, async (err) => {
      try {
        if (!req.file) {
          return res.status(400).json({ message: "No image file provided" });
        }
        const S3 = new S3Client({
          region: "auto",
          endpoint: process.env.ENDPOINT,
          credentials: {
            accessKeyId: process.env.R2_ACCESS_KEY_ID,
            secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
          },
        });

        const fileName = generateUniqueFileName(req.file.originalname);

        await S3.send(
          new PutObjectCommand({
            Body: req.file.buffer,
            Bucket: "ecommerce",
            Key: fileName,
            ContentType: req.file.mimetype,
          })
        );

        const url = `${process.env.R2_DEV_URL}/ecommerce/${fileName}`;

        const media = new Media({
          avatarUrl: url,
        });
        await media.save();
        
        const id = req.user._id;
        const employee = await Employee.findOneAndUpdate(
          { _id: id },
          { avatarId: media._id },
          { new: true }
        );

        return res
          .status(200)
          .json({ message: "Tải ảnh đại diện lên thành công", employee });
      } catch (error) {
        console.log("««««« error »»»»»", error);
        return res
          .status(500)
          .json({ message: "tải ảnh đại diện thất bại", error });
      }
    });
  },

  uploadMultiple: (req, res, next) => {
    const { productId } = req.params;
    upload.array("images", 4)(req, res, async (err) => {
      try {
        if (!req.files || req.files.length === 0) {
          return res.status(400).json({ message: "No image files provided" });
        }

        const S3 = new S3Client({
          region: "auto",
          endpoint: process.env.ENDPOINT,
          credentials: {
            accessKeyId: process.env.R2_ACCESS_KEY_ID,
            secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
          },
        });

        const uploadedFileURLs = [];

        await Promise.all(
          req.files.map(async (file) => {
            const fileName = generateUniqueFileName(file.originalname);
            await S3.send(
              new PutObjectCommand({
                Body: file.buffer,
                Bucket: "ecommerce",
                Key: fileName,
                ContentType: file.mimetype,
              })
            );
            const url = `${process.env.R2_DEV_URL}/ecommerce/${fileName}`;
            uploadedFileURLs.push(url);
          })
        );
        const media = new Media({
          imageUrls: uploadedFileURLs,
          productId: productId,
        });

        const savedMedia = await media.save();

        return res
          .status(200)
          .json({ message: "Tải lên thành công", payload: savedMedia });
      } catch (error) {
        console.log("««««« error »»»»»", error);
        return res.status(500).json({ message: "Upload files error", error });
      }
    });
  },

  uploadMultipleImages: (req, res, next) => {
    upload.array("images", 20)(req, res, async (err) => {
      try {
        if (!req.files || req.files.length === 0) {
          return res.status(400).json({ message: "No image files provided" });
        }
        const S3 = new S3Client({
          region: "auto",
          endpoint: process.env.ENDPOINT,
          credentials: {
            accessKeyId: process.env.R2_ACCESS_KEY_ID,
            secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
          },
        });
        const uploadedFileURLs = [];
        await Promise.all(
          req.files.map(async (file) => {
            const fileName = generateUniqueFileName(file.originalname);
            await S3.send(
              new PutObjectCommand({
                Body: file.buffer,
                Bucket: "ecommerce",
                Key: fileName,
                ContentType: file.mimetype,
              })
            );
            const url = `${process.env.R2_DEV_URL}/ecommerce/${fileName}`;
            uploadedFileURLs.push(url);
          })
        );
        const { name } = req.body;
        const media = new Media({
          name,
          imageUrls: uploadedFileURLs,
        });
        const savedMedia = await media.save();
        return res
          .status(200)
          .json({ message: "Tải lên thành công", payload: savedMedia });
      } catch (error) {
        console.log("««««« error »»»»»", error);
        return res.status(500).json({ message: "Upload files error", error });
      }
    });
  },
};
