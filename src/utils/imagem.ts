export function arquivoParaBase64(
  arquivo: File,
  ladoMaximo = 400,
  qualidade = 0.7,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const leitor = new FileReader();

    leitor.onerror = () => reject(new Error('Não foi possível ler o arquivo.'));

    leitor.onload = () => {
      const imagem = new Image();

      imagem.onerror = () => reject(new Error('O arquivo não é uma imagem válida.'));

      imagem.onload = () => {
        const escala = Math.min(1, ladoMaximo / Math.max(imagem.width, imagem.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(imagem.width * escala);
        canvas.height = Math.round(imagem.height * escala);

        const contexto = canvas.getContext('2d');
        if (!contexto) {
          reject(new Error('Não foi possível processar a imagem.'));
          return;
        }

        contexto.drawImage(imagem, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', qualidade));
      };

      imagem.src = leitor.result as string;
    };

    leitor.readAsDataURL(arquivo);
  });
}
