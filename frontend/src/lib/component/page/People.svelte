<script lang="ts">
  // Team photos TODO: there has to be a better way to import these
  import Hazel from '../../../images/selfies/hazel.png';
  import Allen from '../../../images/selfies/allen.jpg';
  import Tristan from '../../../images/selfies/tristan.jpg';
  import Temp from '../../../images/selfies/temp.jpg';

  interface Person {
    name: string;
    description: string;
    src: string
  }

  const people: Person[] = [
    {
      name: 'Hazel',
      description: `Hazel's intro`,
      src: Hazel
    },
    {
      name: 'Allen',
      description: `Allen's intro`,
      src: Allen
    },
    {
      name: 'Tristan',
      description: `Tristan's intro`,
      src: Tristan
    },
    {
      name: "Temp",
      description: "Temporary",
      src: Temp
    },
    {
      name: "Temp",
      description: "Temporary",
      src: Temp
    },
    {
      name: "Temp",
      description: "Temporary",
      src: Temp
    }
  ]
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


