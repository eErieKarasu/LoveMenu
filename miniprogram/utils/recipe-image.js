const MAX_SOURCE_IMAGE_BYTES = 5 * 1024 * 1024;
const COMPRESSION_THRESHOLD_BYTES = 700 * 1024;

function imageInfo(filePath) {
  return new Promise((resolve) => {
    wx.getImageInfo({ src: filePath, success: resolve, fail: () => resolve({}) });
  });
}

function fileSize(filePath) {
  return new Promise((resolve) => {
    if (!wx.getFileSystemManager) {
      resolve(0);
      return;
    }
    wx.getFileSystemManager().stat({
      path: filePath,
      success: ({ stats }) => resolve(Number(stats && stats.size) || 0),
      fail: () => resolve(0)
    });
  });
}

function compressImage(filePath, info) {
  return new Promise((resolve) => {
    if (!wx.compressImage) {
      resolve(filePath);
      return;
    }
    const options = {
      src: filePath,
      quality: 72,
      success: ({ tempFilePath }) => resolve(tempFilePath || filePath),
      fail: () => resolve(filePath)
    };
    if (Number(info && info.width) >= Number(info && info.height) && Number(info && info.width) > 1600) {
      options.compressedWidth = 1600;
    } else if (Number(info && info.height) > 1600) {
      options.compressedHeight = 1600;
    }
    wx.compressImage(options);
  });
}

async function prepareRecipeImage(file) {
  const sourcePath = String(file && (file.tempFilePath || file.path) || "");
  if (!sourcePath) throw new Error("没有读取到图片");
  const sourceBytes = Number(file && file.size) || await fileSize(sourcePath);
  if (sourceBytes > MAX_SOURCE_IMAGE_BYTES) throw new Error("图片不能超过 5MB");

  const info = await imageInfo(sourcePath);
  const type = String(info.type || "").toLowerCase();
  if (type && !["jpg", "jpeg", "png"].includes(type)) throw new Error("请选择 JPG 或 PNG 图片");

  const shouldCompress = sourceBytes > COMPRESSION_THRESHOLD_BYTES
    || Number(info.width) > 1600
    || Number(info.height) > 1600;
  return shouldCompress ? compressImage(sourcePath, info) : sourcePath;
}

module.exports = {
  COMPRESSION_THRESHOLD_BYTES,
  MAX_SOURCE_IMAGE_BYTES,
  prepareRecipeImage
};
