import type Article from "../data/Entity"

export class ArticleComponent {
    id: number = 0
    assemblyId: number
    componentId: number
    quantity: number = 1
    isOmittable: boolean

    assembly?: Article
    component?: Article
}

export const Entity = ArticleComponent

export default ArticleComponent