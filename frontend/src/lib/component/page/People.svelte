<script lang="ts">
  // Team photos TODO: there has to be a better way to import these
  import Hazel from '../../../images/selfies/hazel.png';
  import Allen from '../../../images/selfies/allen.jpg';
  import Tristan from '../../../images/selfies/tristan.jpg';
  import Meredith from '../../../images/selfies/meredith.jpg';
  import Stephen from '../../../images/selfies/stephen.jpg';
  import Diego from '../../../images/selfies/diego.jpg';

  interface Person {
    name: string;
    description: string;
    src: string;
  }

  const people: Person[] = [
    {
      name: 'Hazel',
      description: `Hi I'm Hazel, full name Haizhen Zhou. I am studying computer science in WA while also doing competitive swimming in my free time.
      I got interested in ML and wanted to learn more! `,
      src: Hazel
    },
    {
      name: 'Allen',
      description: `My name is Allen Feng, and I'm currently a rising senior at Science Hill High School in Tennessee.
      I enjoy playing music, video games, and coding.`,
      src: Allen
    },
    {
      name: 'Tristan',
      description: `I'm Tristan, and I have a passion for computer science and software engineering.
      I like to play the piano and collaborate on projects. I worked on the frontend along with Meredith.`,
      src: Tristan
    },
    {
      name: 'Meredith',
      description: `Hello, I'm Meredith Lo. I am a rising junior at Great Oak High School and
      I like to spend my time drawing, making games, and baking. I worked on the frontend with Tristan.`,
      src: Meredith
    },
    {
      name: 'Stephen',
      description: `Stephen's intro`,
      src: Stephen
    },
    {
      name: 'Diego',
      description: `Diego's intro`,
      src: Diego
    }
  ];
</script>

<div id="people">
  {#each people as person}
    <div class="person">
      <img src={person.src} alt={person.name} />
      <div class="description">
        <p>{person.description}</p>
      </div>
    </div>
  {/each}
</div>

<style>
  #people {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    max-width: 1500px;
    margin: 0 auto;
  }

  img {
    margin: 0;
    display: block;
    height: 25rem;
  }

  .person {
    position: relative;
    overflow: hidden;
  }

  .description {
    position: absolute;
    bottom: -100%;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    transition: bottom 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);
  }

  .person:hover .description {
    bottom: 0;
  }
</style>
