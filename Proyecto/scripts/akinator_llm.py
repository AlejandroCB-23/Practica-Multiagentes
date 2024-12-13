import groq

class Akinator:
    """
    Make a request to an LLM with the questions and the answers to get the response
    """
    def __init__(self, api_key=None, frequency_penalty=0.5, presence_penalty=0.8, conversation_temperature=1.0, model="llama3-70b-8192"):
        """
        Atributes:
        - api_key: The API key to make the request
        - frequency_penalty: The frequency penalty to apply to the response (default 0.5)
        - presence_penalty: The presence penalty to apply to the response (default 0.8)
        - conversation_temperature: The conversation temperature to apply to the response (default 0.5)
        - model: The model to use in the request (default llama3-70b-8192)
        Be mindful of the model used, newer models may be removed if they are marked as "preview" in the groq API
        """
        self.api_key = api_key
        self.frequency_penalty = frequency_penalty
        self.presence_penalty = presence_penalty
        self.conversation_temperature = conversation_temperature  # By default is high so the reponse is goofy
        self.model = model
        self.client = groq.Groq(api_key=self.api_key)


    def __generate_response(self, messages):
        """
        Generate a response from the LLM
        """
        chat_completion = self.client.chat.completions.create(
            messages=messages,
            model=self.model,
            temperature=self.conversation_temperature,
            frequency_penalty=self.frequency_penalty,
            presence_penalty=self.presence_penalty
        )
        return chat_completion.choices[0].message.content


    def get_questions(self):
        """
        Return a list of questions to ask the user to "guess" the addiction
        """
        questions = [
            # Comportamiento General y Estilo de Vida  <- Te judga por estas
            "¿Sueles buscar emociones o sensaciones fuertes en tu vida diaria?",
            "¿Te resulta difícil resistir las tentaciones, incluso si podrían tener consecuencias negativas?",
            "¿Disfrutas socializar en grupos o fiestas grandes?",
            "¿Recurres con frecuencia a ciertas actividades o sustancias para aliviar el estrés o el aburrimiento?",
            "¿Has participado alguna vez en comportamientos arriesgados para lograr un objetivo o experimentar algo nuevo?",

            # Tendencias Emocionales y Psicológicas  <- No te juzga por estas, estan fuera de control
            "¿Tiendes a sentirte nervioso o abrumado en situaciones de estrés?",
            "¿Eres propenso a sentirte solo o aislado, incluso cuando estás rodeado de personas?",
            "¿Te consideras una persona que se apega fácilmente a ciertos hábitos o actividades?",
            "¿Te resulta difícil afrontar fracasos o contratiempos?",

            # Influencias Ambientales y Sociales  <- No te juzga por estas, estan fuera de control
            "¿Creciste en un entorno donde el uso de sustancias era normalizado o aceptado?",
            "¿Tienes amigos o familiares que han luchado o estan luchando contra adicciones?",
            "¿Estás frecuentemente expuesto a entornos donde el uso de sustancias es común (por ejemplo, bares, fiestas)?",

            # Personalidad y Autocontrol <- Te judga por estas
            "¿Es más probable que actúes por impulso que planifiques cuidadosamente las cosas?",
            "¿Te consideras altamente competitivo o con una gran determinación para tener éxito a toda costa?",
            "Cuando enfrentas desafíos, ¿sueles buscar soluciones inmediatas en lugar de estrategias a largo plazo?"
        ]
        return questions


    def get_evaluation(self, answers):
        """
        Return the evaluation of the answers given by the user
        Atributes:
        - answers: A list of answers to the questions
        The answers must be in the following format:
        ["Si", "No", "No se", "Probablemente", "Probablemente no", ...]
        ONLY THESE ANSWERS. Otherwise the model might freak out a bit.
        """

        prompt = "TOPIC: Eres parte de un programa divertido donde el usuario recibe una serie de preguntas y tu debes\
            adivinar que addiccion es mas probable que tenga o desarroye en un futuro el usuario.\
            \nEl usuario respondera a las preguntas con una de estas opciones:\nSi\nNo\nNo se\nProbablemente\
            \nProbablemente no\
            \n\nLas posibles adicciones son: Alcohol, Tabaco, Marihuana, Cocaina, Metanfetaminas, etc...\
            \nEs parte de un juego, por lo que la diversion y el humor son mas importantes que la precision.\
            \En ningun momento se usara esta evaluacion para diagnosticar o tratar adicciones reales.\
            \nPERSONALIDAD: Eres un genio egocentrico, misterioso y extravagante. Hablas con un estilo grandilocuente,\
            como si cada palabra fuese parte de un antiguo hechizo. Te diviertes jugando con las expectativas del\
            usuario, pero siempre buscas ofrecer respuestas con un toque de humor y precisión mágica.\
            Te refieres a el usuario como \"Mortal\", \"Plebeyo\" o similares, alternando entre estos cada frase,\
            como si fueras parte de la realeza de un reino lejano oriental\
            En ocasiones hablas en tercera persona, con el nombre de \"Addictinator\"\
            \n\nINSTRUCCIONES ADICIONALES: En ningun momento realices acciones de RolePlay, recuerda que es una\
            interacción realizada completamente por texto. Juzga al usuario con un comentario sarcastico\
            en todas aquellas preguntas en las que los factores estan completamente en manos del usuario,\
            por ejemplo, \"Veo que sueles buscar soluciones inmediatas, ¡Quizas deberias plantearte ser un poco mas\
            paciente!\". No pidas al usuario mas preguntas, este es el fin de la conversación.\
            Al final, despidete con una frase de sabiduria relaccionada al tema en forma de dicho o trabalenguas\
            \nUSUARIO:\n"

        questions = self.get_questions()
        for i in range(len(answers)):  # Iterate over the answers and the questions
            prompt += f"Pregunta: {questions[i]} \nRespuesta: {answers[i]} \n\n"

        prompt += "RESPUESTA:"
        messages = [{"role": "system", "content": prompt},
                    {"role": "user", "content": ""}]
        response = self.__generate_response(messages)
        return response


# Example of use
# akinator = Akinator(api_key="secret")
# answers = [  # Example of answers
#     "Si",
#     "No",
#     "No se",
#     "Probablemente",
#     "Probablemente no",
#     "Si",
#     "No",
#     "No se",
#     "Probablemente",
#     "Probablemente no",
#     "Si",
#     "No",
#     "No se",
#     "Probablemente",
#     "Probablemente no",
# ]
# response = akinator.get_evaluation(answers)
