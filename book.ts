interface BookPart {
  print(): void;
}

class Page implements BookPart {
  constructor(
    protected content: string,
    protected pageNumber: number
  ) {}

  print(): void {
    console.log(this.content);
    console.log('----------');
    console.log(this.pageNumber);
  }
}

class Section implements BookPart {
  protected children: BookPart[];

  constructor(protected title: string) {}

  addChild(child: BookPart) {
    this.children.push(child);
  }

  print(): void {
    console.log(`-- ${this.title.toUpperCase()} --`);
    this.children.forEach(child => child.print());
  }
}

const book = new Section('Titolo libro');
const sub1 = new Section('Capitolo 1');
const sub2 = new Section('Capitolo 2');
book.addChild(sub1);
book.addChild(sub2);
const subSub1 = new Section('Sottocapitolo 1.1');
sub1.addChild(new Page('contenuto1', 1));
sub1.addChild(new Page('contenuto2', 2));
sub1.addChild(new Page('contenuto3', 3));
sub1.addChild(subSub1);
subSub1.addChild(new Page('contenuto4', 4));
sub2.addChild(new Page('contenuto 5', 5));

book.print();
