class Start extends Scene {
    create() {
        this.engine.setTitle(this.engine.storyData.Title);
        this.engine.addChoice("Begin the story");
    }

    handleChoice() {
        this.engine.gotoScene(Location, this.engine.storyData.InitialLocation);
    }
}

class Location extends Scene {
    create(key) {
        this.key = key; // Store current key for reference
        const locationData = this.engine.storyData.Locations[key];
        this.engine.show(`<p>${locationData.Body}</p>`);

        // Show object if present
        if (locationData.Object) {
            this.engine.show(`<p><strong>You see:</strong> ${locationData.Object.Description}</p>`);
            this.engine.addChoice(locationData.Object.ActionText, { useObject: true, objectEffect: locationData.Object.Effect });
        }

        // Add story choices
        if (locationData.Choices) {
            for (let choice of locationData.Choices) {
                this.engine.addChoice(choice.Text, choice);
            }
        } else {
            this.engine.addChoice("The end.");
        }
    }

    handleChoice(choice) {
    // Handle object interaction first
    if (choice?.useObject) {
        this.engine.show(`<p><em>${choice.objectEffect}</em></p>`);
        this.create(); // Refresh current scene
        return;
    }

    // Check for required flags if they exist
    if (choice?.RequiredFlags) {
        const missingFlags = choice.RequiredFlags.filter(flag => !this.engine.hasFlag(flag));
        if (missingFlags.length > 0) {
            this.engine.show(`<p><em>You can't go there yet. You might be missing something...</em></p>`);
            this.engine.addChoice("Return to Campus Quad", { Target: "CampusQuad" });
            return;
        }
    }

    // Handle MazeTruck special case
    if (this.key === "MazeTruck") {
        const options = ["RamenTruck", "TacoTruck", "HotDogTruck", "DumplingTruck"];
        const randomTarget = options[Math.floor(Math.random() * options.length)];
        this.engine.show(`> You step into the unknown...`);
        this.engine.gotoScene(Location, randomTarget);
        return;
    }

    // Handle normal scene transitions
    if (choice?.Target) {
        this.engine.show(`> ${choice.Text}`);
        this.engine.gotoScene(Location, choice.Target);
        return;
    }

    // Default case (should only reach here for "TheEnd")
    this.engine.gotoScene(End);
}
}

class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}

Engine.load(Start, 'myStory.json');