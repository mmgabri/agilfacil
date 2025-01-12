const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

// Configurações do Cognito
const cognitoRegion = 'ap-south-1';
const userPoolId = 'ap-south-1_nYcPqocLt';
const iss = `https://cognito-idp.${cognitoRegion}.amazonaws.com/${userPoolId}`;

// Configura o cliente JWKS
const client = jwksClient({
  jwksUri: `${iss}/.well-known/jwks.json`,
});

// Função para obter a chave pública
function getKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      return callback(err, null);
    }
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}

// Middleware para validar o token
async function validateToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    //console.log('Cabeçalho Authorization:', authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token não fornecido ou malformado' });
    }

    const token = authHeader.split(' ')[1];
    //console.log('Token extraído:', token);

    // Verificação do token
    jwt.verify(
      token,
      getKey, // Obtém a chave pública dinamicamente
      { issuer: iss }, // Verifica o emissor
      (err, decoded) => {
        if (err) {
          console.error('Erro ao validar token:', err.message);
          return res.status(401).json({ message: 'Token inválido ou malformado' });
        }

        //console.log('Decoded Token:', decoded);

        // Adiciona os dados do usuário à requisição
        req.user = decoded;
        next();
      }
    );
  } catch (error) {
    console.error('Erro inesperado ao validar token:', error.message);
    res.status(401).json({ message: 'Token inválido ou malformado' });
  }
}

module.exports = { validateToken };
