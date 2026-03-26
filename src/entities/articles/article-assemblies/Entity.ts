import type Article from "../data/Entity"

export class ArticleAssembly {
    id: number = 0
    assemblyId: number
    componentId: number
    quantity: number = 1
    isOmittable: boolean

    assembly?: Article
    component?: Article
}

export const Entity = ArticleAssembly

export default ArticleAssembly