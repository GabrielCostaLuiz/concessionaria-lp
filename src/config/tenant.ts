// Este arquivo simula os dados da concessionária que futuramente virão do seu banco de dados Laravel (SaaS multi-tenant).
// Nele garantimos que nada fique "hardcoded" pelo código.

export const tenantConfig = {
    subdomain: process.env.NEXT_PUBLIC_TENANT_SUBDOMAIN || 'pontocerto',
    name: 'Ponto Certo Veículos', // O nome da loja do cliente
    slogan: 'Transparência, confiança e o veículo certo para você',
    logoLetter: 'P', // Pode ser substituído futuramente por uma URL de imagem do S3


    // Informações de Contato
    contact: {
        phoneFormatted: '(11) 99999-8888',
        whatsappRaw: '5511999998888',
        address: 'Av. Brasil, 1500 - São Paulo, SP',
        email: 'contato@autoelite.com.br',
        googleMapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.197472898745!2d-46.6617056!3d-23.5613498!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59c1184a44d1%3A0xc3f191192eb2757!2sAv.%20Brasil%2C%201500%20-%20Jardim%20America%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2001430-001!5e0!3m2!1spt-BR!2sbr!4v1711670000000!5m2!1spt-BR!2sbr',
        googleMapsUrl: 'https://goo.gl/maps/PLACEHOLDER',
        googleQuestionsUrl: 'https://www.google.com/search?q=AutoElite+Motors+Sao+Paulo#lrd=0x94ce59c1184a44d1:0xc3f191192eb2757,1',
    },

    // Links Sociais
    social: {
        instagram: 'https://instagram.com/autoelite',
        facebook: 'https://facebook.com/autoelite',
    }
};
