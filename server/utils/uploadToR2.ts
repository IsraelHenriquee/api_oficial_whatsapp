import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

/**
 * Faz upload de uma mídia para o Cloudflare R2
 * @param mediaBuffer - Buffer com os dados da mídia
 * @param messageType - Tipo da mensagem (image, audio, video, document)
 * @param senderId - ID do remetente
 * @param timestamp - Timestamp da mensagem
 * @param mimeType - MIME type da mídia
 * @returns URL pública da mídia ou null em caso de erro
 */
export async function uploadToR2(
  mediaBuffer: Buffer,
  messageType: string,
  senderId: string,
  timestamp: Date,
  mimeType: string
): Promise<string | null> {
  try {
    const config = useRuntimeConfig()

    // Validar configurações do R2
    if (!config.r2AccessKeyId || !config.r2SecretAccessKey || !config.r2AccountId || !config.r2Bucket) {
      console.error('❌ Configurações do R2 não encontradas')
      return null
    }

    // Criar cliente S3 para R2
    const s3Client = new S3Client({
      region: 'auto',
      endpoint: `https://${config.r2AccountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: config.r2AccessKeyId,
        secretAccessKey: config.r2SecretAccessKey
      }
    })

    // Obter extensão do arquivo baseado no MIME type
    const extension = getFileExtensionFromMimeType(mimeType)
    
    // Formatar timestamp para o nome do arquivo
    const formattedTimestamp = timestamp.getTime()
    
    // Construir o uploadKey: oficial/tipo/senderId/timestamp.extensao
    const uploadKey = `oficial/${messageType}/${senderId}/${formattedTimestamp}.${extension}`

    console.log('📤 Fazendo upload para R2:', {
      key: uploadKey,
      size: mediaBuffer.length,
      mimeType
    })

    // Fazer upload para o R2
    const command = new PutObjectCommand({
      Bucket: config.r2Bucket,
      Key: uploadKey,
      Body: mediaBuffer,
      ContentType: mimeType
    })

    await s3Client.send(command)

    // Construir URL pública
    const mediaURL = `https://files.datafychats.com.br/${uploadKey}`

    console.log('✅ Upload concluído:', mediaURL)

    return mediaURL

  } catch (error: any) {
    console.error('❌ Erro ao fazer upload para R2:', error)
    return null
  }
}

/**
 * Obtém a extensão do arquivo baseada no MIME type
 */
function getFileExtensionFromMimeType(mimeType: string): string {
  // Remover parâmetros extras do MIME type (ex: "audio/ogg; codecs=opus" -> "audio/ogg")
  const cleanMimeType = mimeType.split(';')[0].trim()
  
  const extensions: { [key: string]: string } = {
    // Imagens
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'image/bmp': 'bmp',
    'image/svg+xml': 'svg',
    'image/tiff': 'tiff',
    'image/x-icon': 'ico',
    
    // Vídeos
    'video/mp4': 'mp4',
    'video/mpeg': 'mpeg',
    'video/quicktime': 'mov',
    'video/x-msvideo': 'avi',
    'video/webm': 'webm',
    'video/3gpp': '3gp',
    'video/3gpp2': '3g2',
    'video/x-flv': 'flv',
    'video/x-matroska': 'mkv',
    
    // Áudios
    'audio/mpeg': 'mp3',
    'audio/mp3': 'mp3',
    'audio/ogg': 'ogg',
    'audio/opus': 'opus',
    'audio/wav': 'wav',
    'audio/webm': 'webm',
    'audio/aac': 'aac',
    'audio/x-m4a': 'm4a',
    'audio/mp4': 'm4a',
    'audio/amr': 'amr',
    'audio/3gpp': '3gp',
    'audio/x-ms-wma': 'wma',
    'audio/flac': 'flac',
    
    // Documentos Microsoft Office
    'application/pdf': 'pdf',
    'application/msword': 'doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'application/vnd.ms-excel': 'xls',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
    'application/vnd.ms-excel.sheet.macroenabled.12': 'xlsm',
    'application/vnd.ms-excel.template.macroenabled.12': 'xltm',
    'application/vnd.ms-powerpoint': 'ppt',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
    'application/vnd.ms-powerpoint.presentation.macroenabled.12': 'pptm',
    
    // Documentos de texto
    'text/plain': 'txt',
    'text/rtf': 'rtf',
    'application/rtf': 'rtf',
    'text/csv': 'csv',
    'text/html': 'html',
    'application/xhtml+xml': 'xhtml',
    'application/xml': 'xml',
    'text/xml': 'xml',
    
    // Arquivos compactados
    'application/zip': 'zip',
    'application/x-rar-compressed': 'rar',
    'application/x-7z-compressed': '7z',
    'application/x-tar': 'tar',
    'application/gzip': 'gz',
    'application/x-bzip2': 'bz2',
    
    // Outros formatos comuns
    'application/json': 'json',
    'application/javascript': 'js',
    'text/javascript': 'js',
    'application/typescript': 'ts',
    'application/vnd.oasis.opendocument.text': 'odt',
    'application/vnd.oasis.opendocument.spreadsheet': 'ods',
    'application/vnd.oasis.opendocument.presentation': 'odp',
    'application/epub+zip': 'epub',
    'application/x-shockwave-flash': 'swf'
  }

  return extensions[cleanMimeType] || 'bin'
}
