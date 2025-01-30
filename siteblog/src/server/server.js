import express from 'express'
import cors from 'cors'
import DatabaseService from '../backend/database.js'
import jwt from 'jsonwebtoken'
import session from 'express-session'
import {store,middlewareAuth} from './middleware.js'

const app = express()

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json())

app.use(session({
    store:store,
    secret: 'votre_clef_secrete_tres_longue',
    resave: true,
    saveUninitialized: false,
    name: 'sessionId',
    cookie: {
        secure: false, 
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
    }
}))

app.get('/', async (req, res) => {
    res.json({message:'hello'})
})

app.get('/article/:id',middlewareAuth, async(req, res) => {

    try {

        const id = req.params.id
        const resultat = await DatabaseService.getArticle(id)
    
        if(!resultat.success) {

            return res.status(404).json({
                success: false,
                error: "echec dans la recherche d'article"

            })
        }
    
        res.status(200).json(resultat)
    
    } catch(error) {

        res.status(500).json({
            error: error.message,
            success: false
        })

    }
})

app.post('/login', async (req, res) => {

    try {

        const u = req.body
        const user = await DatabaseService.getUser(u)

        if (!user.success) {

            return res.status(401).json({ 
                error: "Identifiants invalides",
                success: false

            });
        }

        const token = jwt.sign(
            user.user[0],
            'message secret',
            {expiresIn: '1h'}
        )


        const donnee = {
            token,
            user
        }

        req.session.user = user.user[0]
        req.session.token = token


        await req.session.save()

        res.cookie('greetings','hello world')

        res.status(200).json({
            user : user,
            token : req.session.token
        }) 

    } catch(err) {

        res.status(500).json({

            error: err.message,
            success: false

        })
    }
})

app.get('/articles/:id',middlewareAuth, async (req, res) => {
    try {
        const id = req.params.id
        
        const resultat = await DatabaseService.getUserArticles(id)

        if(!resultat.success) {

            return res.status(404).json({
                success: false,
                error: "echec dans la recherche d'articles"

            })
        }

        

        res.status(200).json(resultat)

    } catch(error) {
        return res.status(500).json({
            error: error.message,
            success: false
        })
    }
})

app.post('/articles',middlewareAuth, async (req, res) => {
    
    try {
        const data = req.body
        const reponse = await DatabaseService.createArticle(data)
        
        if(!reponse.success) {
            return res.status(404).json({
                success: false,
                error: "echec dans la creation d'article"
            })
        }

        return res.status(200).json(reponse)

    } catch(error) {
        return res.status(500).json({
            error: error.message,
            success: false
        })
    }
})

app.get('/articles/category/:categorie',middlewareAuth, async(req, res) => {
    try {
        const categorie = req.params.categorie
        const resultat = await DatabaseService.getArticleByCategorie(categorie)
        
        if (!resultat.success) {
            return res.status(404).json({
                success: false,
                error: "Échec dans la recherche d'articles pour cette catégorie"
            })
        }
        
        res.status(200).json(resultat)
        
    } catch(error) {
        res.status(500).json({
            error: error.message,
            success: false
        })
    }
})

app.get('/categories',middlewareAuth, async(req, res) => {
    try {
        const requete = await DatabaseService.getCategorie()

        if(!requete.success) {
            return res.status(404).json({
                success: false,
                error: "Échec dans la recherche de catégorie"
            })
        }

        return res.status(200).json(requete)

    } catch(error) {
        return res.status(500).json({
            error: error.message,
            success: false
        })
    }
})

app.get('/comments/article/:id',middlewareAuth, async(req, res) => {
    try {
        const id = req.params.id
        const response = await DatabaseService.getComments(id)

        if(!response.success) {
            return res.status(200).json({
                success: false,
                error: "echec dans la récuperation des commentaires"
            })
        }

        return res.status(200).json(response)

    } catch(error) {
        return res.status(500).json({
            error: error.message,
            success: false
        })
    }
})

app.post('/comments/article/:id',middlewareAuth, async(req, res) => {
    try {
        const data = req.body
        const response = await DatabaseService.postComment(data)

        if (!response.success) {
            return res.status(404).json({
                success: false,
                error: "Échec dans la création du commentaire"
            })
        }

        return res.status(201).json(response)

    } catch(error) {
        return res.status(500).json({
            error: error.message,
            success: false
        })
    }
})

app.put('/article/:id',middlewareAuth, async (req, res) => {
    try {
        const data = {
            ...req.body,
            article_id: req.params.id
        }
        
        const response = await DatabaseService.updateArticle(data)

        if (!response.success) {
            return res.status(404).json({
                success: false,
                error: "Échec de la modification de l'article"
            })
        }

        return res.status(200).json(response)

    } catch(error) {
        return res.status(500).json({
            error: error.message,
            success: false
        })
    }
})

app.post('/register', async (req, res) => {
    try {
        const userData = req.body;
        const result = await DatabaseService.createUser(userData);
        
        if (!result.success) {
            return res.status(400).json({
                success: false,
                error: "Échec de l'inscription"
            });
        }

        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({
            error: error.message,
            success: false
        });
    }
});

app.put('/user/:id',middlewareAuth, async (req, res) => {
    try {
        const userId = req.params.id;
        const userData = req.body;
        const result = await DatabaseService.updateUser(userId, userData);

        if (!result.success) {
            return res.status(400).json({
                success: false,
                error: "Échec de la mise à jour du profil"
            });
        }

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({
            error: error.message,
            success: false
        });
    }
});

app.delete('/comments/:id',middlewareAuth, async (req, res) => {
    try {
        const commentId = req.params.id;
        const userId = req.body.userId;

        console.log('idCommentaire :' + commentId)
        console.log('userID : ' + userId)

        
        const result = await DatabaseService.deleteComment(commentId, userId);
        
        if (!result.success) {
            return res.status(404).json({
                success: false,
                error: "Échec de la suppression du commentaire"
            });
        }
        
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({
            error: error.message,
            success: false
        });
    }
});

app.delete('/article/:id',middlewareAuth, async (req, res) => {
    try {
        const articleId = req.params.id;
        const userId = req.body.userId;
        
        const result = await DatabaseService.deleteArticle(articleId, userId);
        
        if (!result.success) {
            return res.status(404).json({
                success: false,
                error: "Échec de la suppression de l'article"
            });
        }
        
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({
            error: error.message,
            success: false
        });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port http://localhost:3000')
})
