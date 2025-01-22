import mysql from 'mysql2/promise'

const database = mysql.createPool({
    host: 'localhost',
    database: 'blogdb',
    user: 'root',
    password: 'root'
});

const DatabaseService = {
    // Méthode pour récupérer un utilisateur
    getUser: async function(user) {
        try {
            const req = await database.execute(
                'SELECT * FROM users WHERE email = ? AND password = ?',
                [user.email, user.password]
            );

            if (req[0].length === 0) {
                return {
                    err: "Utilisateur non trouvé",
                    success: false
                }
            }

            return {
                user: req[0],
                success: true
            }
        } catch (error) {
            console.error('Erreur lors de la connexion :', error);
            return {
                err: error,
                success: false
            }
        }
    },

    // Méthode pour récupérer un article
    getArticle: async function(id) {
        try {
            const req = await database.execute(
                'SELECT posts.*, users.username as author FROM posts JOIN users ON posts.user_id = users.id WHERE posts.id = ?',
                [id]
            );

            if (req[0].length === 0) {
                return {
                    err: "Article non trouvé",
                    success: false
                }
            }

            return {
                article: req[0][0],
                success: true
            }
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'article :', error);
            return {
                err: error,
                success: false
            }
        }
    },

    // Méthode pour récupérer les articles d'un utilisateur
    getUserArticles: async function(id) {
        try {
            const req = await database.execute(
                'SELECT * FROM posts WHERE user_id = ?',
                [id]
            );

            if (req[0].length === 0) {
                return {
                    err: "Aucun article trouvé",
                    success: false
                }
            }

            return {
                articles: req[0],
                success: true
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des articles :', error);
            return {
                err: error,
                success: false
            }
        }
    },

    // Méthode pour récupérer les articles par catégorie
    getArticleByCategorie: async function(categorie) {
        try {
            const req = await database.execute(
                "SELECT p.id,p.title,p.slug,p.content,p.excerpt,u.username,c.name,p.published_at from posts p join users u on p.user_id = u.id join categories c on p.category_id = c.id where name = ? order by published_at",
                [categorie]
            );

            if (req[0].length === 0) {
                return {
                    err: "Aucun article trouvé",
                    success: false
                }
            }

            return {
                articles: req[0],
                success: true
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des articles :', error);
            return {
                err: error,
                success: false
            }
        }
    },

    // Méthode pour récupérer les catégories
    getCategorie: async function() {
        try {
            const req = await database.execute('select * from categories');

            if (req[0].length === 0) {
                return {
                    err: "Aucune catégorie trouvé",
                    success: false
                }
            }

            return {
                categories: req[0],
                success: true
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des catégories :', error);
            return {
                err: error,
                success: false
            }
        }
    },

    // Méthode pour créer un article
    createArticle: async function(data) {
        try {
            const req = await database.execute(
                "insert into posts (title,slug,content,excerpt,user_id,category_id,published_at) values (?,?,?,?,?,(select id from categories where name = ?),(select now()))",
                [data.title, data.slug, data.content, data.excerpt, data.author_id, data.categorie]
            );

            if (req[0].length === 0) {
                return {
                    err: "Article non crée",
                    success: false
                }
            }

            return {
                response: req[0],
                success: true
            }
        } catch (error) {
            console.error("Erreur lors de la création de l'article :", error);
            return {
                err: error,
                success: false
            }
        }
    },

    // Méthode pour récupérer les commentaires
    getComments: async function(id) {
        try {
            const req = await database.execute(
                "select comments.*,users.username from comments join users on comments.user_id = users.id where post_id = ?",
                [id]
            );

            if (req[0].length === 0) {
                return {
                    err: "Aucun commentaire trouvé",
                    success: false
                }
            }

            return {
                comments: req[0],
                success: true
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des commentaires :", error);
            return {
                err: error,
                success: false
            }
        }
    },

    // Méthode pour poster un commentaire
    postComment: async function(data) {
        try {
            const req = await database.execute(
                "INSERT INTO comments (content, user_id, post_id, created_at) VALUES (?, ?, ?, NOW())",
                [data.content, data.id_user, data.id_post]
            );

            if (req[0].affectedRows === 0) {
                return {
                    err: "Échec de la création du commentaire",
                    success: false
                }
            }

            return {
                comment: req[0],
                success: true
            }
        } catch (error) {
            console.error("Erreur lors de la création du commentaire :", error);
            return {
                err: error,
                success: false
            }
        }
    },

    // Méthode pour mettre à jour un article
    updateArticle: async function(data) {
        try {
            const req = await database.execute(
                `UPDATE posts 
                SET title = ?, 
                    slug = ?, 
                    content = ?, 
                    excerpt = ?, 
                    category_id = (SELECT id FROM categories WHERE name = ?)
                WHERE id = ? AND user_id = ?`,
                [data.title, data.slug, data.content, data.excerpt, data.categorie, data.article_id, data.user_id]
            );

            if (req[0].affectedRows === 0) {
                return {
                    err: "Article non trouvé ou non autorisé",
                    success: false
                }
            }

            return {
                message: "Article mis à jour avec succès",
                success: true
            }
        } catch (error) {
            console.error("Erreur lors de la modification de l'article :", error);
            return {
                err: error,
                success: false
            }
        }
    },

    // Méthode pour créer un utilisateur
    createUser: async function(userData) {
        try {
            const req = await database.execute(
                `INSERT INTO users (username, email, password, first_name, last_name, created_at, updated_at, is_admin) 
                 VALUES (?, ?, ?, ?, ?, NOW(), NOW(), 0)`,
                [userData.username, userData.email, userData.password, 
                 userData.firstName, userData.lastName]
            );

            if (req[0].affectedRows === 0) {
                return {
                    err: "Échec de la création de l'utilisateur",
                    success: false
                }
            }

            return {
                userId: req[0].insertId,
                success: true
            }
        } catch(error) {
            console.error("Erreur lors de la création de l'utilisateur:", error);
            return {
                err: error,
                success: false
            }
        }
    },

    // Méthode pour mettre à jour un profil utilisateur
    updateUser: async function(userId, userData) {
        try {
            const req = await database.execute(
                `UPDATE users 
                 SET username = ?, 
                     email = ?,
                     first_name = ?,
                     last_name = ?,
                     updated_at = NOW()
                 WHERE id = ?`,
                [userData.username, userData.email, userData.firstName, 
                 userData.lastName, userId]
            );

            if (req[0].affectedRows === 0) {
                return {
                    err: "Utilisateur non trouvé",
                    success: false
                }
            }

            return {
                message: "Profil mis à jour avec succès",
                success: true
            }
        } catch(error) {
            console.error("Erreur lors de la mise à jour du profil:", error);
            return {
                err: error,
                success: false
            }
        }
    },

    // Méthode pour supprimer un commentaire
    deleteComment: async function(commentId, userId) {
        try {

            const req = await database.execute(
                'DELETE FROM comments WHERE id = ? AND user_id = ?',
                [commentId, userId]
            );

            if (req[0].affectedRows === 0) {
                return {
                    err: "Commentaire non trouvé ou non autorisé",
                    success: false
                }
            }

            return {
                message: "Commentaire supprimé avec succès",
                success: true
            }
        } catch(error) {
            console.error("Erreur lors de la suppression du commentaire:", error);
            return {
                err: error,
                success: false
            }
        }
    },

    // Méthode pour supprimer un article
    deleteArticle: async function(articleId, userId) {
        try {
            const req = await database.execute(
                'DELETE FROM posts WHERE id = ? AND user_id = ?',
                [articleId, userId]
            );

            if (req[0].affectedRows === 0) {
                return {
                    err: "Article non trouvé ou non autorisé",
                    success: false
                }
            }

            return {
                message: "Article supprimé avec succès",
                success: true
            }
        } catch(error) {
            console.error("Erreur lors de la suppression de l'article:", error);
            return {
                err: error,
                success: false
            }
        }
    }
}

export default DatabaseService