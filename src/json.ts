import * as json from 'json-to-ast';
import { AST } from '.';

export const parse: AST.ParseFunction = (doc: string) => {
  const x = json(doc, { loc: true });

  switch (x.type) {
    case 'Array':
      return new JsonArrayNode(x);
    case 'Literal':
      return new JsonLiteralNode(x);
    case 'Object':
      return new JsonObjectNode(x);
    default:
      throw new Error(`Unexpected node type: ${x.type}`);
  }
};

export abstract class JsonNode<TNode extends json.ASTNode = json.ASTNode>
  extends AST.BaseNode
  implements AST.ASTNode
{
  constructor(protected readonly source: TNode) {
    super();
  }

  get type() {
    return this.source.type as any;
  }

  get loc() {
    return this.source.loc!;
  }
}

export class JsonObjectNode
  extends JsonNode<json.ObjectNode>
  implements AST.ObjectNode
{
  constructor(node: json.ObjectNode) {
    super(node);
  }

  get children() {
    return this.source.children.map((child) => new JsonPropertyNode(child));
  }
}

export class JsonPropertyNode
  extends JsonNode<json.PropertyNode>
  implements AST.PropertyNode
{
  constructor(node: json.PropertyNode) {
    super(node);
  }

  get key() {
    return new JsonIdentifierNode(this.source.key);
  }

  get value() {
    switch (this.source.value.type) {
      case 'Array':
        return new JsonArrayNode(this.source.value);
      case 'Literal':
        return new JsonLiteralNode(this.source.value);
      case 'Object':
        return new JsonObjectNode(this.source.value);
      default:
        throw new Error(`Unexpected node type: ${this.source.value.type}`);
    }
  }
}

export class JsonIdentifierNode
  extends JsonNode<json.IdentifierNode>
  implements AST.IdentifierNode
{
  constructor(node: json.IdentifierNode) {
    super(node);
  }

  get value() {
    return this.source.value;
  }
}

export class JsonArrayNode
  extends JsonNode<json.ArrayNode>
  implements AST.ArrayNode
{
  constructor(node: json.ArrayNode) {
    super(node);
  }

  get children() {
    return this.source.children.map((child) => {
      switch (child.type) {
        case 'Array':
          return new JsonArrayNode(child);
        case 'Literal':
          return new JsonLiteralNode(child);
        case 'Object':
          return new JsonObjectNode(child);
        default:
          throw new Error(`Unexpected node type: ${child.type}`);
      }
    });
  }
}

export class JsonLiteralNode
  extends JsonNode<json.LiteralNode>
  implements AST.LiteralNode
{
  constructor(node: json.LiteralNode) {
    super(node);
  }

  get value() {
    return this.source.value;
  }
}
